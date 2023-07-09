import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import GameBox from './GameBox'
import fetchData from '../../utils/fetchData'
import { extractLocationInformation, extractLocationAreaInformation } from '../../utils/extractInfo'
import formatName from '../../utils/NameFormatting'

const LocationDetail = () => {
  const { name: locationName } = useParams()
  const locationUrl = `https://pokeapi.co/api/v2/location/${locationName}`

  document.title = `${formatName(locationName)} Pokémon Locations | Pokémon Database`

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

  // Preprocessing the data
  // Group by generation, and then by encounter method.
  // IN other words, generation has a higher hierarchy of grouping, and encounter method has a lower level.
  const finalData = subLocationData?.map(subLocation => {
    const { encounterDetails, subLocationName } = subLocation
    const groupByGenerationEncounter = encounterDetails.reduce((acc, item) => {
      const { methodName, generation } = item
      
      if (!acc[generation]) {
        acc[generation] = []
      }
    
      if (!acc[generation][methodName]) {
        acc[generation][methodName] = []
      }
    
      acc[generation][methodName].push(item)
    
      return acc
    }, [])
    return { subLocationName, encounterDetails: groupByGenerationEncounter }
  })

  console.log('Logging the raw data')
  console.log(subLocationData)

  console.log('Logging the grouped data')
  console.log(finalData)

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
        { key: 'game', value: rowIndex === 0 ? gameName : <GameBox gameName={gameName} activeFlag /> },
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

  // FOR NEW GROUPED DATA
  // const subLocationDivsNew = finalData.map(({subLocationName, encounterDetails}) => {
  //   const generationDiv = 
  //   const tableRows = [...header, ...encounterDetails].map((encounter, rowIndex) => {
  //     const { pokemonName, gameName, generation, levelRange, methodName, chance } = encounter
  //     const trueChance = chance > 100 ? 100 : chance

  //     const cellData = [
  //       { key: 'pokemon', value: formatName(pokemonName) },
  //       { key: 'game', value: rowIndex === 0 ? gameName : <GameBox gameName={gameName} activeFlag /> },
  //       { key: 'generation', value: generation },
  //       { key: 'chance', value: `${trueChance}%` },
  //       { key: 'level range', value: levelRange },
  //       { key: 'method', value: formatName(methodName) },
  //     ]
  //     const tableCells = cellData.map(({key, value}) => {
  //       return (
  //         <div className={`${rowIndex === 0 && 'bg-gray-900 font-bold'} table-cell h-14 border-t-[1px] border-slate-200 align-middle px-2`}>
  //           { value }
  //         </div>
  //       )
  //     })
  //     return (
  //       <div className='table-row'>
  //         { tableCells }
  //       </div>
  //     )
  //   })
  //   return (
  //     <div>
  //       <h1 className='text-2xl font-bold my-8'> { subLocationName } </h1>
  //       <div className='table w-full'>
  //         { tableRows }
  //       </div>    
  //     </div>
  //   )
  // })

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