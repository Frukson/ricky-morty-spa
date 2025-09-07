export enum CharacterStatusEnum {
  Alive = 'Alive',
  Dead = 'Dead',
  unknown = 'unknown',
}

export type CharacterStatus = `${CharacterStatusEnum}`

export function isValidStatus(value: any): value is CharacterStatus {
  return Object.values(CharacterStatusEnum).includes(value)
}

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
