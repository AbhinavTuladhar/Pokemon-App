import fetchData from '..//utils/fetchData'
import { useQuery } from '@tanstack/react-query'

const useEncounterMethods = () => {
  const { data: encounterMethods } = useQuery({
    queryKey: ['encounter-method-list', 'preliminary'],
    queryFn: () => fetchData('https://pokeapi.co/api/v2/encounter-method?limit=31'),
    staleTime: Infinity,
    cacheTime: Infinity,
    select: (data) => {
      const { results } = data
      return results
    },
  })

  const urlList = encounterMethods?.map((obj) => obj.url)

  const { data: encounterMethodDescriptions, isLoading: isLoadingEncounterDescriptions } = useQuery({
    queryKey: ['encounter-method-list', urlList],
    queryFn: () => Promise.all(urlList.map(fetchData)),
    staleTime: Infinity,
    cacheTime: Infinity,
    select: (data) => {
      return data.map((method) => {
        const { name, names, id } = method
        // Find the English description
        const englishDescription = names.find((obj) => obj.language.name === 'en')
        return {
          id,
          name,
          description: englishDescription.name,
        }
      })
    },
  })

  return { encounterMethodDescriptions, isLoadingEncounterDescriptions }
}

export default useEncounterMethods
