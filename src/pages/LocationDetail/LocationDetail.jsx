import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import Skeleton from 'react-loading-skeleton'
import GameBox from './GameBox'
import { FadeInAnimatedTableRowContainer, FadeInAnimationContainer } from '../../components/AnimatedContainers'
import TabularSkeleton from '../../components/TabularSkeleton'
import fetchData from '../../utils/fetchData'
import { generationToGame } from '../../utils/generationToGame'
import { extractLocationInformation, extractLocationAreaInformation } from '../../utils/extractInfo'
import formatName from '../../utils/NameFormatting'

const SimpleSkeletonRow = ({ width }) => {
  return <Skeleton width={width} height='2.75rem' containerClassName='flex-1 w-full' />  
}

const TableCell = ({ value, isHeader }) => {
  return (
    <div className={`${isHeader && 'bg-gray-900 font-bold'} whitespace-nowrap table-cell h-14 border-t-[1px] border-slate-200 align-middle text-center px-4`}>
      { value }
    </div>
  )
}

const TableRow = ({ rowIndex, rowData }) => {
  return (
    <FadeInAnimatedTableRowContainer className='table-row'>
      {rowData.map(( { key, value }) => (
        <TableCell value={value} key={key} isHeader={rowIndex === 0} />
      ))}
    </FadeInAnimatedTableRowContainer>
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

  // Inform the user if there is no encounter information.
  if (subLocationData?.length === 0) {
    return (
      <div className='mx-2 md:mx-10'>
        <h1 className='text-3xl font-bold text-center'>
          { formatName(locationName) }
        </h1>
        <h1 className='text-2xl font-bold text-center'>
          Could not find any encounter information for this location.
        </h1>
      </div>
    )
  }

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

  // Table headers
  const header = [{
    pokemonName: 'Pokemon',
    gameName: 'Games',
    generation: 'Generation',
    levelRange: 'Levels',
    methodName: 'Encounter method',
    chance: 'Chance'
  }]

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
            <div className='flex flex-row items-center pr-16 md:pr-4'>
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
                {generationToGame[generationInternal].map(game => <GameBox gameName={game} activeFlag={gameName.includes(game)} />)}
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
            { isLoadingSubLocationData
            ?
            <SimpleSkeletonRow width='20%' />
            :
            <FadeInAnimationContainer>
              <h1 className='font-bold text-2xl my-4'> 
                {`${formatName(methodName)}`} 
              </h1>
            </FadeInAnimationContainer>
            }
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
          { isLoadingSubLocationData 
          ?
          <SimpleSkeletonRow width='60%' />
          :
          <FadeInAnimationContainer>
            <h1 className='font-bold text-3xl mt-4'> 
              {`${generation} - ${subLocationName}`}
            </h1>
          </FadeInAnimationContainer>
          }
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transitionDuration: '0.8s' }}
      exit={{ opacity: 0, transitionDuration: '0.75s' }}
      className='md:mx-10 mx-2'
    >
      <h1 className='text-3xl font-bold text-center'>
        {
          isLoadingSubLocationData
          ?
          <SimpleSkeletonRow width='50%' />
          :
          <FadeInAnimationContainer>
            {formatName(locationName)}
          </FadeInAnimationContainer>
        }
      </h1>
      
      {/* For rendering skeleton when the content has not been loaded */}
      <>
        {
          isLoadingSubLocationData && (
            <div className='flex flex-col gap-y-5 mt-4'>
              <SimpleSkeletonRow width='50%' />
              <SimpleSkeletonRow width='30%' />
              <TabularSkeleton />
            </div>
          )
        }
      </>

      <>
        {generationDiv?.map(generation => <div className='flex flex-col'> {generation} </div>)}
      </>
    </motion.div>
  )
}

export default LocationDetail