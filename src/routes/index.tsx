import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { CharactersTable } from '@/components/CharactersTable'
import { Box, Heading } from '@chakra-ui/react'
import {
  CharacterStatusEnum,
  type CharacterFilters,
  type CharacterQueryKey,
} from '@/types/api/charactersType'
import { fetchCharacters } from '@/api/characters'

const charactersSearchSchema = z.object({
  page: z.number().catch(1),
  name: z.string().optional().catch(''),
  status: z
    .enum(CharacterStatusEnum)
    .optional()
    .catch(CharacterStatusEnum.unknown),
})

export const Route = createFileRoute('/')({
  validateSearch: charactersSearchSchema,
  component: CharactersListPage,
})

function CharactersListPage() {
  const filters = useSearch({ from: Route.id })

  const navigate = useNavigate({ from: Route.id })

  const queryKey: CharacterQueryKey = ['characters', filters]

  const { data, isLoading, refetch, isError } = useQuery({
    queryKey,
    queryFn: fetchCharacters,
    placeholderData: keepPreviousData,
  })

  const setFilters = (newFilters: Partial<CharacterFilters>) => {
    navigate({
      search: (prev: CharacterFilters) => {
        const cleanUpEmptyFilters = Object.fromEntries(
          Object.entries({ ...prev, ...newFilters }).filter(([_, value]) => {
            return value !== '' && value !== undefined
          }),
        )

        return {
          page: 1, // Page is required if not exist in cleanUpEmptyFilters we set default page = 1
          ...cleanUpEmptyFilters,
        }
      },
      replace: true,
    })
  }

  return (
    <Box p={8} bg="gray.900" color="white" minH="100vh">
      <Heading as="h1" size="2xl" textAlign="center" mb={8} color="cyan.400">
        Characters from Rick and Morty
      </Heading>
      <CharactersTable
        data={data}
        filters={filters}
        setFilters={setFilters}
        isLoading={isLoading}
        refetch={refetch}
        isError={isError}
      />
    </Box>
  )
}
