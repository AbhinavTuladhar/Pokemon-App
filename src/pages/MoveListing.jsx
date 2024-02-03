import { React, useState, useEffect } from 'react'
import { useQuery, useQueries } from '@tanstack/react-query'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import TableContainer from '../components/TableContainer'
import TypeCard from '../components/TypeCard'
import MoveListingSkeleton from '../components/MoveListingSkeleton'
import formatName from '../utils/NameFormatting'
import { extractMoveInformation } from '../utils/extractInfo'
import movePhysical from '../images/move-physical.png'
import moveSpecial from '../images/move-special.png'
import moveStatus from '../images/move-status.png'
import '../index.css'
import fetchData from '../utils/fetchData'

// For damage class image.
const returnMoveImage = (damageClass) => {
  if (damageClass === 'physical') return movePhysical
  else if (damageClass === 'special') return moveSpecial
  else if (damageClass === 'status') return moveStatus
  else return ''
}

const MoveListing = () => {
  const [moveListReady, setMoveListReady] = useState([])
  const [filteredMoves, setFilteredMoves] = useState([])

  // For changing the page title.
  const location = useLocation()
  useEffect(() => {
    document.title = 'Move List'
  }, [location])

  const moveListUrl = 'https://pokeapi.co/api/v2/move?limit=721'

  const { data: moveUrlList, isLoading: isLoadingList } = useQuery({
    queryKey: ['movelist-url', moveListUrl],
    queryFn: () => fetchData(moveListUrl),
    staleTime: Infinity,
    cacheTime: Infinity,
    select: (data) => {
      const moveList = data.results
      return moveList.map((move) => {
        const { name, url } = move
        const replacedUrl = url.replace(/\/move\/\d+\//, `/move/${name}/`)
        return replacedUrl
      })
    },
  })

  const { data: moveData, isFullyLoadedMoveData } = useQueries({
    queries: moveUrlList
      ? moveUrlList.map((url) => {
          return {
            queryKey: ['move-url', url],
            queryFn: ({ signal }) => fetchData(url, signal),
            staleTime: Infinity,
            cacheTime: Infinity,
            select: (data) => {
              const {
                id,
                moveName,
                moveType,
                damageClass,
                power,
                accuracy,
                PP,
                shortEntry,
                effect_chance: effectChance,
                machines,
              } = extractMoveInformation(data)
              return {
                id,
                moveName,
                moveType,
                damageClass,
                power,
                accuracy,
                PP,
                shortEntry,
                effectChance,
                machines,
              }
            },
          }
        })
      : [],
    combine: (results) => {
      return {
        data: results
          ?.map((result) => result?.data)
          .sort((prev, curr) => (prev?.moveName > curr?.moveName ? 1 : -1)),
        isLoading: results.some((result) => result.isLoading),
        isFullyLoadedMoveData: results.every((result) => result.data !== undefined),
      }
    },
  })

  useEffect(() => {
    if (!isFullyLoadedMoveData) return
    setMoveListReady(moveData)
    setFilteredMoves(moveData)
  }, [moveData, isFullyLoadedMoveData])

  const headers = [
    {
      moveName: 'Name',
      moveType: 'Type',
      damageClass: 'Cat.',
      power: 'Power',
      accuracy: 'Acc.',
      PP: 'PP',
      machine: 'TM',
      shortEntry: 'Effect',
      effectChance: 'Prob. (%)',
    },
  ]

  const handleChange = (event) => {
    // There are dashes in the JSON data.
    // Replace any spaces in the query with a dash.
    const searchQuery = event.target.value.toLowerCase().replace(' ', '-')
    const filteredData = moveListReady?.filter((move) => move.moveName.includes(searchQuery))
    setFilteredMoves(filteredData)
  }

  const moveTableRows = [...headers, ...filteredMoves].map((move, index) => {
    const { moveName, moveType, damageClass, power, accuracy, PP, shortEntry, effectChance } = move
    const link = `/moves/${moveName}`
    // Provide a border on all sides and bold the text for the header.
    const headerStyle = index === 0 ? 'font-bold' : ''
    // Separate background colours for the header and odd-even rows.
    let bgColourStyle
    if (index !== 0 && index % 2 === 0) {
      bgColourStyle = 'bg-gray-900'
    } else if (index === 0) {
      bgColourStyle = 'bg-[#1a1a1a]'
    } else {
      bgColourStyle = ''
    }
    // An image for the move type.
    const moveClassImage = returnMoveImage(damageClass)
    // Creating an object for the table cells, abiding by the DRY principle.
    const tableCellData = [
      {
        key: 'moveName',
        value: <NavLink to={link}> {formatName(moveName)} </NavLink>,
        cellStyle: index !== 0 ? 'font-bold hoverable-link' : '',
      },
      {
        key: 'moveType',
        value: index === 0 ? moveType : <TypeCard typeName={moveType} />,
      },
      {
        key: 'damageClass',
        value:
          index === 0 ? (
            damageClass
          ) : (
            <img src={moveClassImage} className="h-[20px] w-[30px]" alt={damageClass} />
          ),
      },
      {
        key: 'power',
        value: power,
      },
      {
        key: 'accuracy',
        value: accuracy,
      },
      {
        key: 'PP',
        value: PP,
      },
      {
        key: 'shortEntry',
        value: <div className="w-[36rem]"> {shortEntry?.replace('$effect_chance% ', '')} </div>,
        cellStyle: 'pr-8 min-w-[36rem]',
      },
      {
        key: 'effectChance',
        value: effectChance,
        cellStyle: 'whitespace-nowrap',
      },
    ]
    const tableCells = tableCellData.map((cell, cellIndex) => {
      return (
        <div
          className={`${cell.cellStyle} ${headerStyle} ${bgColourStyle} table-cell h-12 border-t border-gray-500 p-2 align-middle`}
          key={cellIndex}
        >
          {cell.value}
        </div>
      )
    })
    return (
      <div className={`table-row`} key={index}>
        {tableCells}
      </div>
    )
  })

  document.title = 'Pokémon moves list | Pokémon database'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transitionDuration: '0.8s' }}
      exit={{ opacity: 0, transitionDuration: '0.75s' }}
    >
      <div className="flex items-center justify-center">
        <input
          className="mx-4 mb-4 w-full rounded-xl px-4 py-2 text-black lg:w-[20rem]"
          type="search"
          placeholder="Search for a move"
          disabled={!isFullyLoadedMoveData || isLoadingList}
          onChange={handleChange}
        />
      </div>
      {/* // Checking if data is present */}
      {!isFullyLoadedMoveData || isLoadingList ? (
        <MoveListingSkeleton rowCount={20} />
      ) : (
        <TableContainer child={moveTableRows} />
      )}
    </motion.div>
  )
}

export default MoveListing
