import type { APIResponse } from '@/types/globalTypes'
import type { QueryFunctionContext } from '@tanstack/react-query'

export enum CharacterStatusEnum {
  Alive = 'Alive',
  Dead = 'Dead',
  unknown = 'unknown',
}

type CharacterStatus = keyof typeof CharacterStatusEnum

export interface Character {
  id: number
  name: string
  status: CharacterStatus
  species: string
  type: string
  gender: string
  origin: {
    name: string
    url: string
  }
  location: {
    name: string
    url: string
  }
  image: string
  episode: Array<string>
  url: string
  created: string
}

export interface CharacterFilters {
  page: number
  name?: string | undefined
  status?: CharacterStatus | undefined
}

export type CharacterQueryKey = [string, CharacterFilters]

export const fetchCharacters = async ({
  queryKey,
}: QueryFunctionContext<CharacterQueryKey>): Promise<
  APIResponse<Character>
> => {
  const [_key, { page, name, status }] = queryKey

  // Budujemy parametry URL dynamicznie
  const params = new URLSearchParams({
    page: String(page),
  })
  if (name) {
    params.append('name', name)
  }
  if (status) {
    params.append('status', status)
  }

  const response = await fetch(
    `https://rickandmortyapi.com/api/character?${params.toString()}`,
  )

  if (!response.ok) {
    // API zwraca 404, gdy nie znajdzie pasujących postaci, co traktujemy jako pustą listę
    if (response.status === 404) {
      return {
        info: { count: 0, pages: 0, next: null, prev: null },
        results: [],
      }
    }
    throw new Error('Network response was not ok')
  }

  return await response.json()
}

export const fetchCharacterById = async ({
  queryKey,
}: QueryFunctionContext<[string, number]>): Promise<Character> => {
  const [_, id] = queryKey
  const response = await fetch(
    `https://rickandmortyapi.com/api/character/${id}`,
  )
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}
