import fetchData from '../utils/fetchData'
import { useQuery, useQueries } from '@tanstack/react-query'
import { extractEggGroupInformation } from '../utils/extractInfo'

const useEggGroupList = () => {
  const { data: eggGroupData } = useQuery({
    queryKey: ['egg-group'],
    queryFn: ({ signal }) => fetchData('https://pokeapi.co/api/v2/egg-group', signal),
    staleTime: Infinity,
    cacheTime: Infinity,
    select: (data) => {
      const { results } = data
      return results.map((group) => {
        const { name, url } = group
        return { eggGroup: name, link: url }
      })
    },
  })

  const urlList = eggGroupData?.map((obj) => obj.link)

  const { data: groupPokemonCount, isLoading: isLoadingListData } = useQueries({
    queries: urlList
      ? urlList.map((url) => {
          return {
            queryKey: ['egg-group', url],
            queryFn: ({ signal }) => fetchData(url, signal),
            cacheTime: Infinity,
            staleTime: Infinity,
            select: extractEggGroupInformation,
          }
        })
      : [],
    combine: (results) => {
      return {
        data: results?.map((result) => result?.data).sort((a, b) => a?.eggGroup.localeCompare(b?.eggGroup)),
        isLoading: results.some((result) => result.isLoading),
      }
    },
  })

  return { groupPokemonCount, isLoading: isLoadingListData }
}

export default useEggGroupList
