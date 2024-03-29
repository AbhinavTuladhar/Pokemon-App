import React, { useMemo, useState, useEffect } from 'react'
import { useQueries } from '@tanstack/react-query'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import fetchData from '../utils/fetchData'
import { extractRegionInformation } from '../utils/extractInfo'
import formatName from '../utils/NameFormatting'
import Skeleton from 'react-loading-skeleton'

// This is for sorting on the basis of route number, but doesn't seem to work
// eslint-disable-next-line
const extractNumericPart = (str) => {
  const match = str.match(/\d+/)
  return match ? parseInt(match[0]) : Infinity
}

const LocationList = () => {
  document.title = 'Pokémon Location Guide - all routes, all Pokémon! | Pokémon Database'

  const [activeTab, setActiveTab] = useState(sessionStorage.getItem('storedTab') || '1')

  const locationUrls = useMemo(() => {
    const urlList = []
    for (let i = 1; i <= 6; i++) {
      urlList.push(`https://pokeapi.co/api/v2/region/${i}`)
    }
    return urlList
  }, [])

  const transformData = (data) => {
    const regionExtracted = extractRegionInformation(data)

    // Reformat the objects in the arrays
    const { locations, regionName } = regionExtracted

    const locationsNew = locations
      .map((location) => {
        const { name: locationName, url: actualUrl } = location
        const localUrl = `/location/${locationName}`
        const filteredRoute = locationName.match(/(route-.+)/)
        const properLocationName = filteredRoute !== null ? filteredRoute[1] : locationName
        return { locationName: properLocationName, actualUrl, localUrl }
      })
      .sort((prev, curr) =>
        prev.locationName.localeCompare(curr.locationName, undefined, {
          numeric: true,
          sensitivity: 'base',
        }),
      )

    return { regionName, locations: locationsNew }
  }

  const { data: locationData = [], isLoading } = useQueries({
    queries: locationUrls.map((location) => {
      return {
        queryKey: ['location', location],
        queryFn: () => fetchData(location),
        cacheTime: Infinity,
        staleTime: Infinity,
        select: transformData,
      }
    }),
    combine: (results) => {
      return {
        data: results.map((result) => result.data),
        isLoading: results.some((result) => result.isLoading),
      }
    },
  })

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

  const handleClick = (id) => {
    setActiveTab(id)
  }

  if (isLoading) return

  /**
   * Processing and rendering start
   */

  const tabData = locationData?.map((row, tabIndex) => {
    const { locations, regionName } = row
    const locationItems = locations.map((location, locIndex) => {
      const { locationName, localUrl } = location
      return (
        <NavLink to={localUrl} className="hoverable-link" key={locIndex}>
          {formatName(locationName)}
        </NavLink>
      )
    })

    const tabOutput = (
      <div className="grid grid-cols-flexible gap-x-1" key={tabIndex}>
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
        className={`flex w-20 flex-1 justify-center border-b-2 py-3 ${
          activeTab === id
            ? 'border-blue-500 text-blue-500'
            : 'border-transparent hover:border-white hover:text-white'
        } bg-gray-900 duration-300 hover:cursor-pointer hover:brightness-110`}
        onClick={() => handleClick(id)}
      >
        {' '}
        {formatName(tabName)}{' '}
      </li>
    )
  })

  const tabContainer = tabData?.map((tab, index) => {
    const { output, id } = tab
    return (
      <div key={index} className={`${activeTab === id ? '' : 'hidden'}`}>
        {output}
      </div>
    )
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transitionDuration: '0.8s' }}
      exit={{ opacity: 0, transitionDuration: '0.75s' }}
      className="pb-4"
    >
      <h1 className="text-center text-4xl font-bold">Pokémon Location guide</h1>
      <div>
        {isLoading ? (
          <div className="my-4 flex flex-col gap-y-4">
            <Skeleton containerClassName="flex-1 w-full" className="h-12 w-full" />
            <div className="grid grid-cols-2 gap-y-2 justify-self-center sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {Array(100)
                .fill(0)
                .map((_, index) => (
                  <Skeleton
                    width="50%"
                    height="1.25rem"
                    containerClassName="flex-1 w-full"
                    key={index}
                  />
                ))}
            </div>
          </div>
        ) : (
          <>
            <ul className="my-4 flex flex-1 flex-row flex-wrap items-center justify-center">
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
