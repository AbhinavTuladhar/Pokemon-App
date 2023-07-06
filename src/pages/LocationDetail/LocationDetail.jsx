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

  // Table headers
  const header = [{
    pokemonName: 'Pokemon',
    gameName: 'Games',
    generation: 'Generation',
    levelRange: 'Level range',
    methodName: 'Encounter method',
    chance: 'Chance'
  }]

  // Now construct the tables
  const subLocationDivs = subLocationData.map(({subLocationName, encounterDetails}) => {
    const tableRows = [...header, ...encounterDetails].map((encounter, rowIndex) => {
      const { pokemonName, gameName, generation, levelRange, methodName, chance } = encounter
      const trueChance = chance > 100 ? 100 : chance

      const cellData = [
        { key: 'pokemon', value: formatName(pokemonName) },
        { key: 'game', value: formatName(gameName) },
        { key: 'generation', value: generation },
        { key: 'chance', value: `${trueChance}%` },
        { key: 'level range', value: levelRange },
        { key: 'method', value: formatName(methodName) },
      ]
      const tableCells = cellData.map(({key, value}) => {
        return (
          <div className={`${rowIndex === 0 && 'bg-gray-900 font-bold'} table-cell h-14 border-t-[1px] border-slate-200 align-middle px-2`}>
            { value }
          </div>
        )
      })
      return (
        <div className='table-row'>
          { tableCells }
        </div>
      )
    })
    return (
      <div>
        <h1 className='text-2xl font-bold my-8'> { subLocationName } </h1>
        <div className='table w-full'>
          { tableRows }
        </div>    
      </div>
    )
  })

  return (
    <div className='mx-2 md:mx-10'>
      <h1 className='text-3xl font-bold text-center'>
        { formatName(locationName) }
      </h1>
      <>
        {subLocationDivs.map(subLocation => <div className='flex flex-col'> {subLocation} </div>)}
      </>
      {/* <>
        <span> The locations are: </span>
        <ul className='mt-4'>
          {subLocationNames.map(subLocation => (<li> { formatName(subLocation) } </li>))}
        </ul>
      </> */}
    </div>
  )
}

export default LocationDetail