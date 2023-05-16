import { React, useState, useEffect } from 'react'
import axios from 'axios'

function formatFields(data) {
  const newData = data.endsWith('area') ? data.replace('area', '') : data
  const wordList = newData.split('-')
  // Omit the region if it occurs.
  const wordListNew = wordList.includes('route') ? wordList.slice(1) : wordList
  // Capitalise the first letter of each word.
  const formattedWords = wordListNew.map(word => word.charAt(0).toUpperCase() + word.slice(1))
  // Now join them with spaces.
  return formattedWords.join(' ')
}

// For extracting the information from the complex object.
function extractInformation(data) {
  const information = data?.flatMap(encounter => {
    const { 
      location_area: { name: locationName }, 
      version_details: encounterList 
    } = encounter
    const encounterData = encounterList?.map(version => {
      const { 
        version: {name: versionName}, 
      } = version
      return {
        locationName: formatFields(locationName).trim(),
        versionName: formatFields(versionName),
      };
    });
    return encounterData;
  });
  return information;
}

/*
For grouping the locations by games.
So, if a Pokemon can be found in multiple locations in the same game, they are grouped together, separated by commas
Platinum - route 201
Platinum - route 202
Becomes
Platinum - route 201, route 202
*/
const groupByGame = data => {
  const info = data?.reduce((acc, current) => {
    const { versionName } = current
    const index = acc.findIndex(item => item.versionName === versionName)
    if (index !== -1) {
      acc[index].locationName += `, ${current.locationName}`
    } else {
      acc.push({
        versionName: current.versionName,
        locationName: current.locationName
      })
    }
    return acc
  }, [])
  return info
}

const groupByLocation = data => {
  const info = data?.reduce((acc, current) => {
    const { locationName } = current
    const index = acc.findIndex(item => item.locationName === locationName)
    if (index !== -1) {
      acc[index].versionName.push(current.versionName)
    } else {
      acc.push({
        versionName: [current.versionName],
        locationName: current.locationName
      })
    }
    return acc
  }, [])
  return info
}

const Locations = ({ id, name }) => {
  const [locationData, setLocationData] = useState([]);
  const [finalData, setFinalData] = useState([])

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}/encounters`);
        const data = await response.data;
        setLocationData(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLocationData();
  }, [id]);

  useEffect(() => {
    if (locationData) {
      const information = extractInformation(locationData)
      setFinalData(() => [...information])
      setFinalData(prevState => {
        const groupedByGame = groupByGame(prevState)
        const groupedByLocation = groupByLocation(groupedByGame)
        return [...groupedByLocation]
      })
    }
  }, [locationData])

  // some formatting of the data
  const preFinalTable = finalData?.map(entry => {
    const listItems = entry.versionName.map((version, index) => {
      return <li key={index}> {version} </li>
    })
    const gameList = (<ul className='list-none list-inside'> { listItems } </ul>)
    return { versionName: gameList, locationName: entry.locationName }
  })

  // Now render the final data.
  const finalTable = preFinalTable?.map(row => {
    return (
      <div className={`flex flex-row py-2 border-gray-200 border-t-[1px] px-2 mx-2`}>
        <div className='flex w-2/12 justify-end items-center mx-4 text-right'> {row.versionName} </div>
        <div className='flex w-10/12 justify-start items-center mx-4'> {row.locationName} </div>
      </div>
    )
  })

  if (!finalData) {
    return <h1> Loading </h1>
  }

  // If there is no encounter data, then nothing is rendered.
  return (
    <>
      {
        finalTable.length > 0 &&
        <>
          <div className='font-bold text-3xl mb-10'>
            Where to find { name }
          </div>
          <div className='border-gray-200 border-b-[1px]'>
            {finalTable}
          </div>
        </>
      }
    </>
  )
}

export default Locations