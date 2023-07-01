import React, { useMemo } from 'react'
import { useQuery } from 'react-query'
import { NavLink } from 'react-router-dom'
import fetchData from '../utils/fetchData'
import { extractRegionInformation } from '../utils/extractInfo'
import formatName from '../utils/NameFormatting'

// This is for sorting on the basis of route number, but doesn't seem to work
const extractNumericPart = (str) => {
  const match = str.match(/\d+/);
  return match ? parseInt(match[0]) : Infinity;
};

const LocationList = () => {
  const locationUrls = useMemo(() => {
    const urlList = []
    for (let i = 1; i <= 7; i++) {
      urlList.push(`https://pokeapi.co/api/v2/region/${i}`)
    }
    return urlList
  }, [])

  const transformData = data => {
    const regionExtracted = data.map(extractRegionInformation)

    // Reformat the objects in the arrays
    return regionExtracted.map(region => {
      const { locations, regionName } = region

      const locationsNew = locations.map(location => {
        const { name: locationName, url: actualUrl } = location
        const localUrl = `/location/${locationName}`
        const filteredRoute = locationName.match(/(route-.+)/)
        const properLocationName = filteredRoute !== null ? filteredRoute[1] : locationName
        console.log(locationName)
        return { locationName: properLocationName, actualUrl, localUrl }
      })
      .sort((prev, curr) => {
        return prev.locationName >= curr.locationName ? 1 : -1
      })
      // .sort((prev, curr) => {
      //     const numA = extractNumericPart(prev.locationName);
      //     const numB = extractNumericPart(curr.locationName);
      //     // return -numA + numB || curr.locationName.localeCompare(prev.locationName); // Handle tie-breaker with localeCompare
      //     return numA - numB || (prev.locationName >= curr.locationName ? 1 : -1)
      // })
      return { regionName, locations: locationsNew }
    })
  }

  const { data: locationData = [], isLoading } = useQuery(
    ['locationData', locationUrls],
    () => Promise.all(locationUrls.map(fetchData)),
    { cacheTime: Infinity, staleTime: Infinity, select: transformData }
  )

  if (isLoading) return

  const toRender = locationData.map((row) => {
    const { locations, regionName } = row
    const locationItems = locations.map((location) => {
      const { locationName, localUrl } = location
      return (
        <NavLink to={localUrl} className='hoverable-link'>
          { formatName(locationName) }
        </NavLink>
      )
    })
    return (
      <div className='flex flex-col flex-wrap'>
        <h1 className='text-3xl font-bold my-4'> { formatName(regionName) } </h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'>
          { locationItems }
        </div>
      </div>
    )
  })

  return (
    <div className='mx-2 md:mx-10'>
      { toRender }
    </div>
  )
}

export default LocationList