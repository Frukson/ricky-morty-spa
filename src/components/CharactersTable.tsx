import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Link } from '@tanstack/react-router'
import { CharacterStatusEnum } from '../api/characters'
import type { Character, CharacterFilters } from '../api/characters'
import type { APIResponse } from '@/types/globalTypes'
import {
  Box,
  Flex,
  Input,
  Button,
  Table,
  Text,
  HStack,
  Select,
  createListCollection,
} from '@chakra-ui/react'

interface CharactersTableProps {
  data: APIResponse<Character> | undefined
  filters: CharacterFilters
  setFilters: (newFilters: Partial<CharacterFilters>) => void
  isLoading: boolean
  refetch: () => void
}

const columnHelper = createColumnHelper<Character>()

export function CharactersTable({
  data,
  filters,
  setFilters,
  isLoading,
  refetch,
}: CharactersTableProps) {
  const columns = [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: (info) => (
        <Link
          to="/characters/$characterId"
          params={{ characterId: info.row.original.id }}
          search={{
            page: filters.page,
            name: filters.name,
            status: filters.status,
          }}
          className="font-bold text-cyan-400 hover:underline"
        >
          {info.getValue()}
        </Link>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
    }),
    columnHelper.accessor('species', {
      header: 'Species',
    }),
  ]

  const table = useReactTable({
    data: data?.results ?? [],
    columns,
    pageCount: data?.info.pages ?? 0,
    state: {
      pagination: {
        pageIndex: filters.page - 1,
        pageSize: 20, // API Rick & Morty has hardcoded pagesize = 20
      },
    },
    manualPagination: true,
    manualFiltering: true,
    getCoreRowModel: getCoreRowModel(),
  })

  const statusSelectCollection = createListCollection({
    items: [
      { value: '', label: 'All' },
      { value: CharacterStatusEnum.Alive, label: 'Alive' },
      { value: CharacterStatusEnum.Dead, label: 'Dead' },
      { value: CharacterStatusEnum.unknown, label: 'Unknown' },
    ],
  })

  return (
    <Box>
      <Flex wrap="wrap" gap={4} mb={4} p={4} bg="gray.800" borderRadius="lg">
        <Input
          placeholder="Filter by name..."
          value={filters.name ?? ''}
          onChange={(e) => setFilters({ name: e.target.value, page: 1 })}
          bg="gray.700"
          border="none"
          _placeholder={{ color: 'gray.400' }}
          _focus={{ bg: 'gray.600' }}
        />

        <Select.Root
          value={[filters.status ?? '']}
          onValueChange={(details) =>
            setFilters({
              status:
                details.value[0] === ''
                  ? undefined
                  : (details.value[0] as CharacterFilters['status']),
              page: 1,
            })
          }
          collection={statusSelectCollection}
        >
          <Select.Trigger
            bg="gray.700"
            border="none"
            _focus={{ bg: 'gray.600' }}
          >
            <Select.ValueText placeholder="All statuses" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item item={{ value: '', label: 'All' }}>
              <Select.ItemText>All</Select.ItemText>
            </Select.Item>
            <Select.Item
              item={{ value: CharacterStatusEnum.Alive, label: 'Alive' }}
            >
              <Select.ItemText>Alive</Select.ItemText>
            </Select.Item>
            <Select.Item
              item={{ value: CharacterStatusEnum.Dead, label: 'Dead' }}
            >
              <Select.ItemText>Dead</Select.ItemText>
            </Select.Item>
            <Select.Item
              item={{ value: CharacterStatusEnum.unknown, label: 'Unknown' }}
            >
              <Select.ItemText>Unknown</Select.ItemText>
            </Select.Item>
          </Select.Content>
        </Select.Root>

        <Button
          onClick={() =>
            setFilters({ name: undefined, status: undefined, page: 1 })
          }
          colorScheme="yellow"
          variant="solid"
        >
          Clear filters
        </Button>

        <Button
          onClick={() => refetch()}
          colorScheme="blue"
          variant="solid"
          loading={isLoading}
        >
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </Flex>

      <Table.Root bg="gray.800" borderRadius="lg" size="md">
        <Table.Header>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Row key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Table.ColumnHeader
                  key={header.id}
                  color="white"
                  borderColor="gray.700"
                  p={4}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          ))}
        </Table.Header>

        <Table.Body>
          {table.getRowModel().rows.map((row) => (
            <Table.Row
              key={row.id}
              _hover={{ bg: 'gray.700' }}
              transition="background-color 0.2s"
            >
              {row.getVisibleCells().map((cell) => (
                <Table.Cell key={cell.id} borderColor="gray.700" p={4}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <HStack justify="center" gap={4} mt={8}>
        <Button
          onClick={() => setFilters({ page: 1 })}
          disabled={filters.page === 1}
          variant="outline"
          colorScheme="gray"
        >
          {'<<'}
        </Button>

        <Button
          onClick={() => setFilters({ page: filters.page - 1 })}
          disabled={filters.page === 1}
          variant="outline"
          colorScheme="gray"
        >
          {'<'}
        </Button>

        <Text color="white" px={4}>
          Page {filters.page} of {table.getPageCount()}
        </Text>

        <Button
          onClick={() => setFilters({ page: filters.page + 1 })}
          disabled={filters.page >= table.getPageCount()}
          variant="outline"
          colorScheme="gray"
        >
          {'>'}
        </Button>

        <Button
          onClick={() => setFilters({ page: table.getPageCount() })}
          disabled={filters.page >= table.getPageCount()}
          variant="outline"
          colorScheme="gray"
        >
          {'>>'}
        </Button>
      </HStack>
    </Box>
  )
}
