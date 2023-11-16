import React from 'react'
import { useQuery, useQueries } from '@tanstack/react-query'
import fetchData from '../utils/fetchData'

const BerryListing = () => {
  const { data: berryList } = useQuery({
    queryKey: 'berry-list',
    queryFn: () => fetchData('https://pokeapi.co/api/v2/berry?limit=100'),
    staleTime: Infinity,
    cacheTime: Infinity,
    select: data => data.results
  })

  const results = useQueries({
    queries: berryList
      ? berryList.map((berry) => {
        return {
          queryKey: ['berry', berry.name],
          queryFn: () => fetchData(berry.url)
        }
      })
      : []
  })

  console.log(results)

  return (
    <div>BerryListing</div>
  )
}

export default BerryListing