import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { useQuery } from 'react-query'
import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { extrctAbilityInformation } from '../utils/extractInfo'
import MoveListingSkeleton from '../components/MoveListingSkeleton'
import TableContainer from '../components/TableContainer'
import formatName from '../utils/NameFormatting'

const AbilityListing = () => {
  const [abilityInfo, setAbilityInfo] = useState([])

  const urlList = useMemo(() => {
    let urls = []
    // default is 191 (acc to chatgpt)
    for (let i = 1; i <= 191; i++) {
      urls.push(`https://pokeapi.co/api/v2/ability/${i}/`)
    }
    return urls
  }, [])

  // For querying the URLs.
  const fetchData = async (url) => {
    const response = await axios.get(url)
    return response.data
  }

  const { data: abilityData } = useQuery(
    ['moveData', urlList],
    () => Promise.all(urlList.map(fetchData)),
    { staleTime: Infinity, cacheTime: Infinity }
  )

  // Extract the information and sort in alphabetical order.
  useEffect(() => {
    if (abilityData) {
      const extracted = abilityData
        ?.map(ability => extrctAbilityInformation(ability))
        ?.sort((a, b) => a?.name > b?.name ? 1 : -1)
      setAbilityInfo(extracted)
    }
  }, [abilityData])

  // Headers that are used in the table.
  const headers = [{
     name: 'Name',
     pokemonCount: 'Pokemon',
     shortEntry: 'Description' ,
     generationIntroduced: 'Gen.' ,
  }]

  const tableRows = [...headers, ...abilityInfo].map((row, index) => {
    const { id, name, pokemonCount, shortEntry, generationIntroduced } = row
    const headerStyle = index === 0 ? 'font-bold sticky top-0' : ''
    const abilityLink = `/ability/${id}`

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
        value: (<NavLink to={abilityLink}> {formatName(name)} </NavLink>), 
        style: index !== 0 ? 'text-blue-400 font-bold hover:text-red-500 hover:underline duration-300 whitespace-nowrap' : '' 
      },
      { key: 'Pokemon', value: pokemonCount, style: index !== 0 ? 'text-right' : '' },
      { key: 'Description', value: shortEntry },
      { 
        key: 'Generation', 
        value: index === 0 ? generationIntroduced : generationIntroduced?.slice(-1) 
      },
    ]
    const tableCells = cellData.map(cell => (
      <div className={`${headerStyle} ${bgColour} ${cell?.style} table-cell border-gray-500 border-t-[1px] h-12 align-middle py-2 px-4`}>
        { cell.value }
      </div>
    ))

    return (
      <div className='table-row'>
        { tableCells }
      </div>
    )
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transitionDuration: '0.8s' }}
      exit={{ opacity: 0, transitionDuration: '0.75s' }}
      className='mx-4'
    >
      { 
        // Checking if data is present
        (tableRows?.length < 2) 
        ?
        <MoveListingSkeleton rowCount={20} />
        :
        <TableContainer child={tableRows} />
      }
    </motion.div>
  )
}

export default AbilityListing