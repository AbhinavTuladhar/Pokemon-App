import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import fetchData from '../../utils/fetchData'
import { extractLocationInformation, extractLocationAreaInformation } from '../../utils/extractInfo'
import formatName from '../../utils/NameFormatting'

const LocationDetail = () => {
  const { name: locationName } = useParams()
  const locationUrl = `https://pokeapi.co/api/v2/location/${locationName}`

  const { data: locationData = [], isLoading: isLoadingLocationData } = useQuery(
    ['largerLocation', locationName],
    () => fetchData(locationUrl),
    { staleTime: Infinity, cacheTime: Infinity, select: extractLocationInformation }
  )

  // if (isLoadingLocationData) return

  const subLocationNames = locationData?.subLocations?.map(subLocation => subLocation.name)
  const subLocationUrls = locationData?.subLocations?.map(subLocation => subLocation.url)

  // Query information about all the sub locations (or location areas)
  const transformSubLocationData = data => {
    return data.map(extractLocationAreaInformation)
  }

  const { data: subLocationData, isLoading: isLoadingSubLocationData } = useQuery(
    ['subLocationData', locationData],
    () => Promise.all(subLocationUrls.map(fetchData)),
    { staleTime: Infinity, cacheTime: Infinity, select: transformSubLocationData }
  )

  console.log(subLocationData)

  if (isLoadingSubLocationData) return

  return (
    <div className='mx-2 md:mx-10'>
      <h1 className='text-3xl font-bold text-center'>
        { formatName(locationName) }
      </h1>
      <>
        <span> The locations are: </span>
        <ul className='mt-4'>
          {subLocationNames.map(subLocation => (<li> { formatName(subLocation) } </li>))}
        </ul>
      </>
    </div>
  )
}

export default LocationDetail