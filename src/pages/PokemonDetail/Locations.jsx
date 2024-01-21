import React from 'react'
import { useQuery } from '@tanstack/react-query'
import SectionTitle from '../../components/SectionTitle'
import fetchData from '../../utils/fetchData'
import formatName from '../../utils/NameFormatting'

function formatFields(data) {
  const newData = data.endsWith('area') ? data.replace('area', '') : data
  const wordList = newData.split('-')
  // Omit the region if it occurs.
  const wordListNew = wordList.includes('route') ? wordList.slice(1) : wordList
  // Capitalise the first letter of each word.
  const formattedWords = wordListNew.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  // Now join them with spaces.
  return formattedWords.join(' ')
}

// For extracting the information from the complex object.
function extractInformation(data) {
  const information = data?.flatMap((encounter) => {
    const {
      location_area: { name: locationName },
      version_details: encounterList,
    } = encounter
    const encounterData = encounterList?.map((version) => {
      const {
        version: { name: versionName },
      } = version
      return {
        locationName: formatFields(locationName).trim(),
        versionName: formatFields(versionName),
      }
    })
    return encounterData
  })
  return information
}

/*
For grouping the locations by games.
So, if a Pokemon can be found in multiple locations in the same game, they are grouped together, separated by commas
Platinum - route 201
Platinum - route 202
Becomes
Platinum - route 201, route 202
*/
const groupByGame = (data) => {
  const info = data?.reduce((acc, current) => {
    const { versionName } = current
    const index = acc.findIndex((item) => item.versionName === versionName)
    if (index !== -1) {
      acc[index].locationName += `, ${current.locationName}`
    } else {
      acc.push({
        versionName: current.versionName,
        locationName: current.locationName,
      })
    }
    return acc
  }, [])
  return info
}

const groupByLocation = (data) => {
  const info = data?.reduce((acc, current) => {
    const { locationName } = current
    const index = acc.findIndex((item) => item.locationName === locationName)
    if (index !== -1) {
      acc[index].versionName.push(current.versionName)
    } else {
      acc.push({
        versionName: [current.versionName],
        locationName: current.locationName,
      })
    }
    return acc
  }, [])
  return info
}

const Locations = ({ props }) => {
  const { id, name } = props

  const transformData = (locationData) => {
    const information = extractInformation(locationData)
    const groupedByGame = groupByGame(information)
    const groupedByLocation = groupByLocation(groupedByGame)
    return groupedByLocation
  }

  const { data: finalData = [], isLoading } = useQuery({
    queryKey: ['locations', id, name],
    queryFn: () => fetchData(`https://pokeapi.co/api/v2/pokemon/${id}/encounters`),
    staleTime: Infinity,
    cacheTime: Infinity,
    select: transformData,
  })

  // some formatting of the data
  const preFinalTable = finalData?.map((entry, topIndex) => {
    const listItems = entry.versionName.map((version, index) => {
      return <li key={index}> {version} </li>
    })
    const gameList = <ul className="list-none list-inside"> {listItems} </ul>
    return { versionName: gameList, locationName: entry.locationName }
  })

  // Now render the final data.
  const finalTable = preFinalTable?.map((row, rowIndex) => {
    return (
      <div className="table-row py-2 border-gray-200 border-t px-2 mx-2" key={rowIndex}>
        <div className="table-cell w-2/12 border-gray-200 border-t py-2 mx-4 align-middle text-right">
          {' '}
          {row.versionName}{' '}
        </div>
        <div className="table-cell border-gray-200 border-t py-2 pl-4 align-middle first-line:mx-4">
          {' '}
          {row.locationName}{' '}
        </div>
      </div>
    )
  })

  if (isLoading) {
    return
  }

  // If there is no encounter data, then nothing is rendered.
  return (
    <>
      {finalTable.length > 0 && (
        <>
          <SectionTitle text={`Where to find ${formatName(name)}`} />
          <div className="border-gray-200 border-b table w-full">{finalTable}</div>
        </>
      )}
    </>
  )
}

export default Locations
