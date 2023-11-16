import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import Skeleton from 'react-loading-skeleton'
import GameBox from './GameBox'
import TabularSkeleton from '../../components/TabularSkeleton'
import fetchData from '../../utils/fetchData'
import { generationToGame } from '../../utils/generationToGame'
import { extractLocationInformation, extractLocationAreaInformation } from '../../utils/extractInfo'
import formatName from '../../utils/NameFormatting'
import commonRarity from '../../images/rarity-common.png'
import uncommonRarity from '../../images/rarity-uncommon.png'
import rareRarity from '../../images/rarity-rare.png'
import limitedRarity from '../../images/rarity-limited.png'
import useEncounterMethods from '../../hooks/useEncounterMethods'
import { Tooltip } from 'react-tooltip'

/**
 * For mapping the encounter chance to the corresponding pie chart image
 * @param (chance) the encounter chance.
 * @returns the corresponding image source.
 */
const getRarityImage = (chance, methodName) => {
  if (methodName === 'only-one') {
    return limitedRarity
  }

  if (chance >= 50) {
    return commonRarity
  } else if (chance >= 20 && chance < 50) {
    return uncommonRarity
  } else {
    return rareRarity
  }
}

const getRarityString = (chance, methodName) => {
  if (methodName === 'only-one') {
    return 'limited'
  }

  if (chance >= 50) {
    return 'common'
  } else if (chance >= 20 && chance < 50) {
    return 'uncommon'
  } else {
    return 'rare'
  }
}

const SimpleSkeletonRow = ({ width }) => {
  return <Skeleton width={width} height='2.75rem' containerClassName='flex-1 w-full' />
}

const TableCell = ({ value, isHeader }) => {
  return (
    <div className={`${isHeader && 'bg-gray-900 font-bold'} whitespace-nowrap table-cell h-14 border-t border-slate-200 align-middle text-center px-4`}>
      {value}
    </div>
  )
}

const TableRow = ({ rowIndex, rowData }) => {
  return (
    <div className='table-row'>
      {rowData.map(({ key, value }, index) => (
        <TableCell value={value} key={key} index={index} isHeader={rowIndex === 0} />
      ))}
    </div>
  )
}

const LocationDetail = () => {
  const { name: locationName } = useParams()
  const locationUrl = `https://pokeapi.co/api/v2/location/${locationName}`

  const { encounterMethodDescriptions, isLoadingEncounterDescriptions } = useEncounterMethods()

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
      <div>
        <h1 className='text-3xl font-bold text-center'>
          {formatName(locationName)}
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
            methods: [{ methodName, encounterDetails: [encounter] }]
          });
        }
      } else {
        result.push({
          generation,
          subLocations: [{ subLocationName, methods: [{ methodName, encounterDetails: [encounter] }] }],
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
  const generationDiv = groupedByGenerationSubLocationAndMethod?.map(({ generation, subLocations }, divIndex) => {
    // Next is the sub location div.
    const subLocationDivNew = subLocations?.map(({ subLocationName, methods }, subIndex) => {
      // Finally, the encounter methods.
      const encounterMethodDiv = methods?.map(({ methodName, encounterDetails }, methodIndex) => {
        // Find the name of the encounter method description
        const encounterDescription = encounterMethodDescriptions?.find(method => method.name === methodName).description

        const tableRows = [...header, ...encounterDetails]?.map((encounter, rowIndex) => {
          const { iconSprite, pokemonName, generationInternal, gameName, levelRange, chance } = encounter
          // const trueChance = chance > 100 ? 100 : chance
          const chanceImage = getRarityImage(chance, methodName)
          const rarityString = getRarityString(chance, methodName)

          // For the identifying div
          const idDiv = (
            <div className='flex flex-row items-center pr-16 md:pr-4'>
              <img src={iconSprite} alt={pokemonName} className='w-[66px]' />
              <NavLink to={`/pokemon/${pokemonName}`} className='font-bold hoverable-link'>
                {formatName(pokemonName)}
              </NavLink>
            </div>
          )

          // For the game boxes
          const gameBoxDiv = rowIndex === 0
            ? gameName
            : (
              <div className='flex flex-row'>
                {generationToGame[generationInternal].map((game, index) => <GameBox gameName={game} activeFlag={gameName.includes(game)} key={index} />)}
              </div>
            )

          // For the pie-chart rarity image
          const rarityImage = <img src={chanceImage} alt={chance} className='w-[30px] hover:cursor-help' id={rarityString} />

          const cellData = [
            { key: 'pokemon', value: rowIndex === 0 ? formatName(pokemonName) : idDiv },
            { key: 'game', value: gameBoxDiv },
            { key: 'chance', value: rowIndex === 0 ? 'Rarity' : rarityImage },
            { key: 'level range', value: levelRange },
          ]
          return <TableRow rowData={cellData} rowIndex={rowIndex} key={rowIndex} />
        })
        // Now render the sub location name, with the generation as the prefix.
        return (
          <div key={methodIndex}>
            {isLoadingSubLocationData
              ?
              <SimpleSkeletonRow width='20vw' />
              :
              <div className='flex flex-col my-4 gap-y-1'>
                <h1 className='text-2xl font-bold'>
                  {`${formatName(methodName)}`}
                </h1>
                <span className='text-sm text-gray-400'>
                  {encounterDescription}
                </span>
              </div>
            }
            <div className='flex justify-center'>
              <div className='w-full overflow-auto lg:w-7/12'>
                <div className='table mx-auto border-b border-slate-200'>
                  {tableRows}
                </div>
              </div>
            </div>
          </div>
        )
      })
      return (
        <div key={subIndex}>
          {isLoadingSubLocationData
            ?
            <SimpleSkeletonRow width='60vw' />
            :
            <h1 className='mt-4 text-3xl font-bold'>
              {`${generation} - ${subLocationName}`}
            </h1>
          }
          <div key={subIndex}> {encounterMethodDiv} </div>
        </div>
      )
    })
    return (
      <div key={divIndex}>
        {subLocationDivNew}
      </div>
    )
  })

  const tooltipData = [
    { id: '#common', text: 'Common' },
    { id: '#uncommon', text: 'Uncommon' },
    { id: '#rare', text: 'Rare' },
    { id: '#limited', text: 'Limited' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transitionDuration: '0.8s' }}
      exit={{ opacity: 0, transitionDuration: '0.75s' }}
    >
      <h1 className='text-3xl font-bold text-center'>
        {isLoadingSubLocationData ?
          <SimpleSkeletonRow width='50vw' />
          : (
            <>
              {formatName(locationName)}
            </>
          )}
      </h1>

      <>
        {tooltipData.map((row, index) => (
          <Tooltip anchorSelect={row.id} place='bottom' key={index}>
            {row.text}
          </Tooltip>
        ))}
      </>

      {/* For rendering skeleton when the content has not been loaded */}
      <>
        {(isLoadingSubLocationData || isLoadingEncounterDescriptions) ? (
          <div className='flex flex-col mt-4 gap-y-5'>
            <SimpleSkeletonRow width='50%' />
            <SimpleSkeletonRow width='30%' />
            <TabularSkeleton />
          </div>
        ) : (
          generationDiv?.map((generation, index) => <div className='flex flex-col' key={index}> {generation} </div>)
        )}
      </>
    </motion.div>
  )
}

export default LocationDetail