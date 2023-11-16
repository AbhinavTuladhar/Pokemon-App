import React from 'react'
import { useQuery, useQueries } from '@tanstack/react-query'
import fetchData from '../utils/fetchData'

const BerryListing = () => {
  const { data: berryList } = useQuery(
    'berry-list',
    () => fetchData('https://pokeapi.co/api/v2/berry?limit=100'),
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      select: data => data.results
    }
  )

  const berryUrls = berryList?.map(berry => berry.url)

  // const results = useQueries(berryList?.map(berry => {
  //   return {
  //     queryKey: ['bery', berry?.url],
  //     queryFn: () => fetchData(berry?.url)
  //   }
  // }))

  // console.log(results)

  // const { data: berryInfo } = useQuery(
  //   ['berry-list', berryUrls || []],
  //   () => Promise.all(berryUrls.map(fetchData)),
  //   {
  //     staleTime: Infinity,
  //     cacheTime: Infinity,
  //   }
  // )

  // console.log(berryInfo)

  return (
    <div>BerryListing</div>
  )
}

export default BerryListing