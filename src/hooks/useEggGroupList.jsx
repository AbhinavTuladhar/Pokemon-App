import fetchData from '..//utils/fetchData'
import { useQuery } from '@tanstack/react-query'
import { extractEggGroupInformation } from '../utils/extractInfo'

const useEggGroupList = () => {
  const { data: eggGroupData } = useQuery({
    queryKey: ['egg-group'],
    queryFn: () => fetchData('https://pokeapi.co/api/v2/egg-group'),
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

  // Get the number of pokemon in each egg group
  const { data: groupPokemonCount, isLoading: isLoadingListData } = useQuery({
    queryKey: ['egg-group', eggGroupData],
    queryFn: () => Promise.all(urlList.map(fetchData)),
    staleTime: Infinity,
    cacheTime: Infinity,
    select: (data) => {
      return data.map(extractEggGroupInformation).sort((a, b) => a.eggGroup.localeCompare(b.eggGroup))
    },
  })

  return { groupPokemonCount, isLoading: isLoadingListData }
}

export default useEggGroupList
