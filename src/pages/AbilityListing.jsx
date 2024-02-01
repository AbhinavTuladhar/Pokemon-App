import React, { useState, useEffect } from 'react'
import { useQuery, useQueries } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import fetchData from '../utils/fetchData'
import MoveListingSkeleton from '../components/MoveListingSkeleton'
import TableContainer from '../components/TableContainer'
import formatName from '../utils/NameFormatting'
import { extractAbilityInformation } from '../utils/extractInfo'
import '../index.css'

const AbilityListing = () => {
  const [abilityInfo, setAbilityInfo] = useState([])
  const [filteredAbilityInfo, setFilteredAbilityInfo] = useState([])

  const resourceUrl = `https://pokeapi.co/api/v2/ability?limit=233`
  // const resourceUrl = `https://pokeapi.co/api/v2/ability?limit=10`

  // Query the ability resource list endpoint
  const { data: abilityUrls, isLoading: isLoadingList } = useQuery({
    queryKey: ['ability-listing', resourceUrl],
    queryFn: () => fetchData(resourceUrl),
    staleTime: Infinity,
    cacheTime: Infinity,
    select: (data) => {
      const abilityList = data.results
      return abilityList.map((ability) => {
        const { name, url } = ability
        const replacedUrl = url.replace(/\/ability\/\d+\//, `/ability/${name}/`)
        return replacedUrl
      })
    },
  })

  const { data: abilityData, isFullyLoaded } = useQueries({
    queries: abilityUrls
      ? abilityUrls.map((url) => {
          return {
            queryKey: ['ability-url', url],
            queryFn: ({ signal }) => fetchData(url, signal),
            staleTime: Infinity,
            cacheTime: Infinity,
          }
        })
      : [],
    combine: (results) => {
      return {
        data: results?.map((result) => result?.data),
        isLoading: results.some((result) => result.isLoading),
        isFullyLoaded: results.every((result) => result.data !== undefined),
      }
    },
  })

  // Extract the information and sort in alphabetical order.
  useEffect(() => {
    if (!abilityData) {
      return
    }
    const extracted = abilityData
      ?.map((ability) => extractAbilityInformation(ability))
      ?.sort((a, b) => (a?.name > b?.name ? 1 : -1))
    setAbilityInfo(extracted)
    setFilteredAbilityInfo(extracted)
  }, [abilityData])

  const handleChange = (event) => {
    // There are dashes in the JSON data.
    // Replace any spaces in the query with a dash.
    const searchQuery = event.target.value.toLowerCase().replace(' ', '-')
    const filteredData = abilityInfo?.filter((ability) => ability.name.includes(searchQuery))
    setFilteredAbilityInfo(filteredData)
  }

  // Headers that are used in the table.
  const headers = [
    {
      name: 'Name',
      pokemonCount: 'Pokemon',
      shortEntry: 'Description',
      generationIntroduced: 'Gen.',
    },
  ]

  const tableRows = [...headers, ...filteredAbilityInfo]?.map((row, index) => {
    const { name, pokemonCount, shortEntry, generationIntroduced } = row || {}
    const headerStyle = index === 0 ? 'font-bold' : ''
    const abilityLink = `/ability/${name}`

    // Separate background colours for the header and odd-even rows.
    let bgColour
    if (index !== 0 && index % 2 === 0) {
      bgColour = 'bg-gray-900'
    } else if (index === 0) {
      bgColour = 'bg-[#1a1a1a]'
    } else {
      bgColour = ''
    }

    const cellData = [
      {
        key: 'Name',
        value: <NavLink to={abilityLink}> {formatName(name)} </NavLink>,
        cellStyle: index !== 0 ? 'font-bold hoverable-link whitespace-nowrap' : '',
      },
      { key: 'Pokemon', value: pokemonCount, cellStyle: index !== 0 ? 'text-right' : '' },
      { key: 'Description', value: shortEntry, cellStyle: 'min-w-[32rem]' },
      {
        key: 'Generation',
        value: index === 0 ? generationIntroduced : generationIntroduced?.slice(-1),
      },
    ]
    const tableCells = cellData.map((cell, cellIndex) => (
      <div
        className={`${headerStyle} ${bgColour} ${cell?.cellStyle} table-cell border-gray-500 border-t h-12 align-middle py-2 px-4`}
        key={cellIndex}
      >
        {cell.value}
      </div>
    ))

    return (
      <div className="table-row" key={index}>
        {tableCells}
      </div>
    )
  })

  // Set the document title
  document.title = 'Pokémon abilities list | Pokémon database'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transitionDuration: '0.8s' }}
      exit={{ opacity: 0, transitionDuration: '0.75s' }}
    >
      <div className="flex items-center justify-center">
        <input
          className="text-black rounded-xl mx-4 mb-4 py-2 px-4 w-full lg:w-[20rem]"
          type="search"
          placeholder="Search for an ability..."
          disabled={!isFullyLoaded || isLoadingList}
          onChange={handleChange}
        />
      </div>
      {
        // Checking if data is present
        !isFullyLoaded || isLoadingList ? <MoveListingSkeleton rowCount={20} /> : <TableContainer child={tableRows} />
      }
    </motion.div>
  )
}

export default AbilityListing
