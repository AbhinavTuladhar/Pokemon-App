import React, { useMemo, useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import fetchData from '../utils/fetchData'
import { extractRegionInformation } from '../utils/extractInfo'
import formatName from '../utils/NameFormatting'
import Skeleton from 'react-loading-skeleton'

// This is for sorting on the basis of route number, but doesn't seem to work
const extractNumericPart = (str) => {
  const match = str.match(/\d+/);
  return match ? parseInt(match[0]) : Infinity;
};

const LocationList = () => {
  document.title = 'Pokémon Location Guide - all routes, all Pokémon! | Pokémon Database'

  const [activeTab, setActiveTab] = useState(1)
  // const tabData = []

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
          // return prev.locationName >= curr.locationName ? 1 : -1
          // using localeCompare to take into consideration the route numbers.
          return prev.locationName.localeCompare(curr.locationName, undefined, { numeric: true, sensitivity: 'base' })
        })
      return { regionName, locations: locationsNew }
    })
  }

  const { data: locationData = [], isLoading } = useQuery(
    ['locationData', locationUrls],
    () => Promise.all(locationUrls.map(fetchData)),
    { cacheTime: Infinity, staleTime: Infinity, select: transformData }
  )

  useEffect(() => {
    // Setting the selected tab using session storage.
    const storedSelectedTab = sessionStorage.getItem('storedTab')
    if (storedSelectedTab) {
      setActiveTab(parseInt(storedSelectedTab))
    } else {
      setActiveTab(1)
    }
  }, [])

  useEffect(() => {
    // When navigating back to the location list page, retrieve the stored tab.
    sessionStorage.setItem('storedTab', activeTab.toString())
  }, [activeTab])

  if (isLoading) return

  const handleClick = id => {
    setActiveTab(id)
  }

  // For 
  const tabData = locationData?.map((row, tabIndex) => {
    const { locations, regionName } = row
    const locationItems = locations.map((location) => {
      const { locationName, localUrl } = location
      return (
        <NavLink to={localUrl} className='hoverable-link min-w-fit'>
          {formatName(locationName)}
        </NavLink>
      )
    })

    const tabOutput = (
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 justify-self-center'>
        {locationItems}
      </div>
    )

    return { id: tabIndex + 1, tabName: regionName, output: tabOutput }
  })

  const tabListItems = tabData?.map((tab, index) => {
    const { tabName, id } = tab
    return (
      <li
        key={index}
        className={`w-20 py-3 border-b-2 flex flex-1 justify-center ${activeTab === id ? 'text-blue-500 border-blue-500' : 'border-transparent hover:text-white hover:border-white'
          } hover:cursor-pointer hover:brightness-110 bg-gray-900 duration-300`}
        onClick={() => handleClick(id)}
      > {formatName(tabName)} </li>
    )
  })

  const tabContainer = tabData?.map((tab, index) => {
    const { output, id } = tab
    return (
      <div
        key={index}
        className={`${activeTab === id ? '' : 'hidden'}`}
      >
        {output}
      </div>
    )
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transitionDuration: '0.8s' }}
      exit={{ opacity: 0, transitionDuration: '0.75s' }}
      className='pb-4 mx-2 md:mx-10'
    >
      <h1 className='text-4xl font-bold text-center'>
        Pokémon Location guide
      </h1>
      <div>
        {isLoading ? (
          <div className='flex flex-col gap-y-4 my-4'>
            <Skeleton containerClassName='flex-1 w-full' className='w-full h-12' />
            <div className='grid grid-cols-2 gap-y-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 justify-self-center'>
              {Array(100).fill(0).map((_, index) => (
                <Skeleton width='50%' height='1.25rem' containerClassName='flex-1 w-full' key={index} />
              ))}
            </div>
          </div>
        ) : (
          <>
            <ul className='flex flex-row flex-wrap items-center justify-center flex-1 my-4'>
              {tabListItems}
            </ul>
            {tabContainer}
          </>
        )}
      </div>
    </motion.div>
  )
}

export default LocationList