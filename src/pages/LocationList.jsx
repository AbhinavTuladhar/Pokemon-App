import React, { useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { NavLink } from 'react-router-dom'
import fetchData from '../utils/fetchData'
import { extractRegionInformation } from '../utils/extractInfo'
import formatName from '../utils/NameFormatting'
import { FadeInAnimationContainer } from '../components/AnimatedContainers'

// This is for sorting on the basis of route number, but doesn't seem to work
const extractNumericPart = (str) => {
  const match = str.match(/\d+/);
  return match ? parseInt(match[0]) : Infinity;
};

const LocationList = () => {
  const [activeTab, setActiveTab] = useState(1)
  const tabData = []

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

  const handleClick = id => {
    setActiveTab(id)
  }

  // For 
  locationData.forEach((row, tabIndex) => {
    const { locations, regionName } = row
    const locationItems = locations.map((location) => {
      const { locationName, localUrl } = location
      return (
        <NavLink to={localUrl} className='hoverable-link min-w-fit'>
          { formatName(locationName) }
        </NavLink>
      )
    })

    const tabOutput = (
      <div className='grid grid-cols-2 sm:grid-cols-3 smmd:grid-cols-4 lg:grid-cols-5 justify-self-center'>
        { locationItems }
      </div>
    )

    const currentTabData = { id: tabIndex + 1, tabName: regionName, output: tabOutput }
    tabData.push(currentTabData)
  })

  const tabListItems = tabData.map((tab, index) => {
    const { tabName, id } = tab
    return (
      <li 
        key={index} 
        className={`w-20 py-2 mx-1 border-b-2 border-transparent flex justify-center ${
          activeTab === id ? 'text-blue-500 border-b-2 border-blue-500' : 'hover:text-white hover:border-white'
        } hover:cursor-pointer duration-300`}
        onClick={() => handleClick(id)}
      > { formatName(tabName) } </li> 
    )
  })

  const tabContainer = tabData.map((tab, index) => {
    const { output, id } = tab
    return (
      <div
        key={index}
        className={`${activeTab === id ? '' : 'hidden'}`}
      >
        { output }
      </div>
    )
  })

  return (
    <FadeInAnimationContainer className='mx-2 md:mx-10'>
      <h1 className='text-4xl text-center font-bold'>
        Pokémon Location guide
      </h1>
      <>
        <ul className='flex flex-wrap flex-row justify-center items-center my-4'> 
          { tabListItems }
        </ul>
        <>
          { tabContainer }
        </>
      </>
    </FadeInAnimationContainer>
  )
}

export default LocationList