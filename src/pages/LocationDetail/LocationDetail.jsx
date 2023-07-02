import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import fetchData from '../../utils/fetchData'
import { extractLocationInformation } from '../../utils/extractInfo'
import formatName from '../../utils/NameFormatting'

const LocationDetail = () => {
  const { name: locationName } = useParams()
  const locationUrl = `https://pokeapi.co/api/v2/location/${locationName}`

  const { data: locationData, isLoading } = useQuery(
    ['largerLocation', locationName],
    () => fetchData(locationUrl),
    { staleTime: Infinity, cacheTime: Infinity, select: extractLocationInformation }
  )

  if (isLoading) return

  const subLocationNames = locationData.subLocations.map(subLocation => subLocation.name)

  console.log(locationData)
  console.log({subLocationNames})

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