import { extractMoveInformation } from '../utils/extractInfo'
import fetchData from '../utils/fetchData'
import { useQueries } from '@tanstack/react-query'

const useMoveDetail = (urls) => {
  const { data, isLoading } = useQueries({
    queries: urls.map((url) => {
      return {
        queryKey: ['move-url', url],
        queryFn: () => fetchData(url),
        staleTime: Infinity,
        cacheTime: Infinity,
        select: extractMoveInformation,
      }
    }),
    combine: (results) => {
      return {
        data: results.map((result) => result.data),
        isLoading: results.some((result) => result.isLoading),
      }
    },
  })

  return { data, isLoading }
}

export default useMoveDetail
