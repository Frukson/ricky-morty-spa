import type { Character, CharacterQueryKey } from '@/types/api/charactersType'
import type { APIResponse } from '@/types/globalTypes'
import type { QueryFunctionContext } from '@tanstack/react-query'

const API_BASE_URL = 'https://rickandmortyapi.com/api/character'

export const fetchCharacters = async ({
  queryKey,
}: QueryFunctionContext<CharacterQueryKey>): Promise<
  APIResponse<Character>
> => {
  const [_key, { page, name, status }] = queryKey

  const params = new URLSearchParams({
    page: String(page),
  })
  if (name) {
    params.append('name', name)
  }
  if (status) {
    params.append('status', status)
  }

  const response = await fetch(`${API_BASE_URL}?${params.toString()}`)

  if (!response.ok) {
    if (response.status === 404) {
      return {
        info: { count: 0, pages: 0, next: null, prev: null },
        results: [],
      }
    }
  }
  return await response.json()
}

export const fetchCharacterById = async ({
  queryKey,
}: QueryFunctionContext<[string, number]>): Promise<Character> => {
  const [_, id] = queryKey
  const response = await fetch(`${API_BASE_URL}/${id}`)

  return response.json()
}
