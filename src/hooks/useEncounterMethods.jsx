import fetchData from '..//utils/fetchData'
import { useQuery, useQueries } from '@tanstack/react-query'

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

  const { data: encounterMethodDescriptions, isLoading: isLoadingEncounterDescriptions } = useQueries({
    queries: urlList
      ? urlList.map((url) => {
          return {
            queryKey: ['encounter-method', url],
            queryFn: ({ signal }) => fetchData(url, signal),
            cacheTime: Infinity,
            staleTime: Infinity,
            select: (data) => {
              const { name, names, id } = data
              // Find the English description
              const englishDescription = names.find((obj) => obj.language.name === 'en')
              return {
                id,
                name,
                description: englishDescription.name,
              }
            },
          }
        })
      : [],
    combine: (results) => {
      return {
        data: results?.map((result) => result?.data),
        isLoading: results.some((result) => result.isLoading),
      }
    },
  })
  return { encounterMethodDescriptions, isLoadingEncounterDescriptions }
}

export default useEncounterMethods
