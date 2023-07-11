import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { NavLink } from 'react-router-dom'
import GameBox from './GameBox'
import fetchData from '../../utils/fetchData'
import { generationToGame } from '../../utils/generationToGame'
import { extractLocationInformation, extractLocationAreaInformation } from '../../utils/extractInfo'
import formatName from '../../utils/NameFormatting'

const TableCell = ({ value, isHeader }) => {
  return (
    <div className={`${isHeader && 'bg-gray-900 font-bold'} whitespace-nowrap table-cell h-14 border-t-[1px] border-slate-200 align-middle px-4`}>
      { value }
    </div>
  )
}

const TableRow = ({ rowIndex, rowData }) => {
  return (
    <div className='table-row'>
      {rowData.map(( { key, value }) => (
        <TableCell value={value} key={key} isHeader={rowIndex === 0} />
      ))}
    </div>
  )
}

const LocationDetail = () => {
  const { name: locationName } = useParams()
  const locationUrl = `https://pokeapi.co/api/v2/location/${locationName}`

  document.title = `${formatName(locationName)} Pokémon Locations | Pokémon Database`

  const { data: locationData = [] } = useQuery(
    ['largerLocation', locationName],
    () => fetchData(locationUrl),
    { staleTime: Infinity, cacheTime: Infinity, select: extractLocationInformation }
  )

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

  // First group by generation, then by sublocation and then by encounter method.
  const groupedByGenerationSubLocationAndMethod = subLocationData?.reduce((result, obj) => {
    const { encounterDetails, subLocationName } = obj
  
    encounterDetails.forEach((encounter) => {
      const { generation, methodName } = encounter
  
      const existingGenerationGroup = result.find((group) => group.generation === generation);
  
      if (existingGenerationGroup) {
        const existingSubLocationGroup = existingGenerationGroup.subLocations.find((subLocation) => subLocation.subLocationName === subLocationName);
  
        if (existingSubLocationGroup) {
          const existingMethodGroup = existingSubLocationGroup.methods.find((method) => method.methodName === methodName);
  
          if (existingMethodGroup) {
            existingMethodGroup.encounterDetails.push(encounter);
          } else {
            existingSubLocationGroup.methods.push({
              methodName,
              encounterDetails: [encounter],
            });
          }
        } else {
          existingGenerationGroup.subLocations.push({ 
            subLocationName, 
            methods: [{ methodName, encounterDetails: [encounter]}]
          });
        }
      } else {
        result.push({
          generation,
          subLocations: [{ subLocationName, methods: [{ methodName, encounterDetails: [encounter] }]}],
        })
      }
    })
    return result;
  }, []).sort((prev, curr) => prev.generation <= curr.generation ? 1 : -1) // Next sort by the generation.

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

  console.log(groupedByGenerationSubLocationAndMethod)

  /*
  This is for creating a more sophisticated version of the tables
  IN the highest level, we have the generation.
  In the next level is the sub location name
  Last comes the encounter method.
  Since all the above information have already been rendered, we omit them from the table.
  */
  // Generation is at the highest level, so the generation divs come first.
  const generationDiv = groupedByGenerationSubLocationAndMethod?.map(({generation, subLocations}) => {
    // Next is the sub location div.
    const subLocationDivNew = subLocations?.map(({subLocationName, methods}) => {
      // Finally, the encounter methods.
      const encounterMethodDiv = methods?.map(({methodName, encounterDetails}) => {
        const tableRows = [...header, ...encounterDetails].map((encounter, rowIndex) => {
          const { iconSprite, pokemonName, generationInternal, gameName, levelRange, chance } = encounter
          const trueChance = chance > 100 ? 100 : chance

          // For the identifying div
          const idDiv = (
            <div className='flex flex-row items-center'>
              <img src={iconSprite} alt={pokemonName} className='w-[66px]' />
              <NavLink to={`/pokemon/${pokemonName}`} className='hoverable-link font-bold'>
                { formatName(pokemonName)}
              </NavLink>
            </div>
          )

          // For the game boxes
          const gameBoxDiv = rowIndex === 0 
            ? gameName 
            : (
              <div className='flex flex-row'>
                {generationToGame[generationInternal].map(game => <GameBox gameName={game} activeFlag={gameName === game} />)}
              </div>
            )

          const cellData = [
            { key: 'pokemon', value: rowIndex === 0 ? formatName(pokemonName) : idDiv },
            { key: 'game', value: gameBoxDiv },
            { key: 'chance', value: `${trueChance}%` },
            { key: 'level range', value: levelRange },
          ]
          return <TableRow rowData={cellData} rowIndex={rowIndex} key={rowIndex} />
        })
        // Now render the sub location name, with the generation as the prefix.
        return (
          <>
            <h1 className='font-bold text-2xl my-4'> {`${formatName(methodName)}`} </h1>
            <div className='flex justify-center'>
              <div className='overflow-auto w-full lg:w-7/12'>
                <div className='table border-b-[1px] border-slate-200 mx-auto'>
                  { tableRows }
                </div>
              </div>  
            </div> 
          </>
        )
      })
      return (
        <>
          <h1 className='font-bold text-3xl mt-4'> {`${generation} - ${subLocationName}`} </h1>
          <> { encounterMethodDiv } </>
        </>
      )
    })
    return (
      <>
        { subLocationDivNew }
      </>    
    )
  })

  return (
    <div className='mx-2 md:mx-10'>
      <h1 className='text-3xl font-bold text-center'>
        { formatName(locationName) }
      </h1>
      <>
        {generationDiv.map(generation => <div className='flex flex-col'> {generation} </div>)}
      </>
    </div>
  )
}

export default LocationDetail