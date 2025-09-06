import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import {
  Box,
  Flex,
  Heading,
  Text,
  Image,
  Badge,
  VStack,
  Spinner,
  Button,
} from '@chakra-ui/react'
import { fetchCharacterById } from '../api/characters'

const paramsSchema = z.object({
  characterId: z.string().transform((val) => {
    const parsed = parseInt(val, 10)
    if (isNaN(parsed) || parsed < 1) {
      throw new Error(`Invalid character ID: ${val}`)
    }
    return parsed
  }),
})

export const Route = createFileRoute('/characters/$characterId')({
  parseParams: (params) => paramsSchema.parse(params),
  beforeLoad: ({ params }) => {
    const parsed = params.characterId
    if (isNaN(parsed) || parsed < 1) {
      throw redirect({
        to: '/',
        search: { page: 1 },
      })
    }
  },
  component: CharacterDetailsPage,
})

function CharacterDetailsPage() {
  const { characterId } = Route.useParams()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['character', characterId],
    queryFn: fetchCharacterById,
  })

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="100vh" bg="gray.900">
        <VStack gap={4}>
          <Spinner size="xl" color="cyan.400" />
          <Text color="white" fontSize="lg">
            Loading...
          </Text>
        </VStack>
      </Flex>
    )
  }

  if (isError) {
    return (
      <Flex justify="center" align="center" minH="100vh" bg="gray.900" p={8}>
        Błąd: {error.message}
      </Flex>
    )
  }

  if (!data) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Alive':
        return 'green'
      case 'Dead':
        return 'red'
      default:
        return 'gray'
    }
  }

  return (
    <Box
      p={8}
      bg="gray.900"
      color="white"
      minH="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <VStack gap={6} maxW="4xl" w="full">
        <Box alignSelf="flex-start">
          <Link
            to="/"
            search={{
              page: 1,
              name: '',
              status: undefined,
            }}
            style={{
              color: '#00bcd4',
              fontSize: '1.125rem',
              textDecoration: 'none',
            }}
          >
            <Button
              color="cyan.400"
              fontSize="lg"
              _hover={{ textDecoration: 'underline' }}
            >
              ← Back to list
            </Button>
          </Link>
        </Box>

        <Box bg="gray.800" borderRadius="lg" overflow="hidden" w="full">
          <Flex direction={{ base: 'column', md: 'row' }} w="full">
            {/* Character Image */}
            {data?.image && (
              <Box w={{ base: 'full', md: '33%' }}>
                <Image
                  src={data.image}
                  alt={data?.name || 'Character'}
                  w="full"
                  h="full"
                  objectFit="cover"
                />
              </Box>
            )}

            <Box p={8} flex="1">
              {data?.name && (
                <Heading as="h1" size="2xl" mb={6} color="cyan.400">
                  {data.name}
                </Heading>
              )}

              <VStack gap={3} align="stretch">
                {data?.status && (
                  <Text fontSize="lg">
                    <Text as="span" fontWeight="bold" color="cyan.300">
                      Status:
                    </Text>{' '}
                    <Badge
                      colorScheme={getStatusColor(data.status)}
                      ml={2}
                      px={2}
                      py={1}
                      borderRadius="md"
                    >
                      {data.status}
                    </Badge>
                  </Text>
                )}

                {data?.species && (
                  <Text fontSize="lg">
                    <Text as="span" fontWeight="bold" color="cyan.300">
                      Species:
                    </Text>{' '}
                    {data.species}
                  </Text>
                )}

                {data?.type && (
                  <Text fontSize="lg">
                    <Text as="span" fontWeight="bold" color="cyan.300">
                      Type:
                    </Text>{' '}
                    {data.type}
                  </Text>
                )}

                {data?.gender && (
                  <Text fontSize="lg">
                    <Text as="span" fontWeight="bold" color="cyan.300">
                      Gender:
                    </Text>{' '}
                    {data.gender}
                  </Text>
                )}

                {data?.origin?.name && (
                  <Text fontSize="lg">
                    <Text as="span" fontWeight="bold" color="cyan.300">
                      Origin:
                    </Text>{' '}
                    {data.origin.name}
                  </Text>
                )}

                {data?.location?.name && (
                  <Text fontSize="lg">
                    <Text as="span" fontWeight="bold" color="cyan.300">
                      Last known location:
                    </Text>{' '}
                    {data.location.name}
                  </Text>
                )}

                {data?.created && (
                  <Text fontSize="lg">
                    <Text as="span" fontWeight="bold" color="cyan.300">
                      Created:
                    </Text>{' '}
                    {new Date(data.created).toLocaleDateString('pl-PL')}
                  </Text>
                )}
              </VStack>
            </Box>
          </Flex>
        </Box>
      </VStack>
    </Box>
  )
}
