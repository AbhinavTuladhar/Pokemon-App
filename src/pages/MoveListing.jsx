import { React, useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { useQuery } from 'react-query'
import TableContainer from '../components/TableContainer'
import extractMoveInformation from '../utils/extractMoveInfo'
import formatName from '../utils/NameFormatting'
import TypeCard from '../components/TypeCard'
import movePhysical from '../images/move-physical.png'
import moveSpecial from '../images/move-special.png'
import moveStatus from '../images/move-status.png'
import { motion } from 'framer-motion'

// For damage class image.
const returnMoveImage = damageClass => {
  if (damageClass === 'physical')
    return movePhysical
  else if (damageClass === 'special')
    return moveSpecial
  else if (damageClass === 'status')
    return moveStatus
  else
    return ''
}

const MoveListing = () => {
  const [moveList, setMoveList] = useState([])

  // This fetches the URLs of all the moves
  const urlList = useMemo(() => {
    let urls = []
    for (let i = 1; i <= 621; i++) {
      urls.push(`https://pokeapi.co/api/v2/move/${i}/`)
    }
    return urls
  }, [])

  // For fetching data from a url.
  const fetchData = async (url) => {
    const response = await axios.get(url)
    return response.data
  }

  // Perform a GET request on all the 'calculated' URLs.
  const { data: moveData, isLoading } = useQuery(
    ['moveData', urlList],
    () => Promise.all(urlList.map(fetchData)),
    { staleTime: Infinity, cacheTime: Infinity }
  )

  useEffect(() => {
    if (moveData) {
      const extracted = moveData.map(move => extractMoveInformation(move))
      console.log('printing raw move data')
      console.log(moveData)
      setMoveList(() => {
        const extractedNew = extracted.map(move => {
          const { moveName, moveType, damageClass, power, accuracy, PP, shortEntry, effect_chance: effectChance } = move
          return { moveName, moveType, damageClass, power, accuracy, PP, shortEntry, effectChance }
        })
        // sorting alphabetically
        return extractedNew.sort((prev, curr) => prev.moveName > curr.moveName ? 1 : -1)
      })
    }
  }, [moveData])

  if (!moveData) {
    return (
      <div className='flex justify-center text-3xl'> Loading. It'll take some time since there are 621 moves! </div>
    )
  }

  const headers = [{
    moveName: 'Name',
    moveType: 'Type',
    damageClass: 'Cat.',
    power: 'Power',
    accuracy: 'Acc.',
    PP: 'PP',
    shortEntry: 'Effect',    
    effectChance: 'Prob. (%)'
  }]

  const moveTableRows = [...headers, ...moveList].map((move, index) => {
    const { moveName, moveType, damageClass, power, accuracy, PP, shortEntry, effectChance } = move
    // Provide a border on all sides and bold the text for the header.
    const headerStyle = index === 0 ? 'font-bold' : ''
    const moveClassImage = returnMoveImage(damageClass)
    // Creating an object for the DRY principle.
    const tableCellData = [
      { key: 'moveName', value: formatName(moveName) },
      { key: 'moveType', value: index === 0 ? moveType : <TypeCard typeName={ moveType } /> },
      { key: 'damageClass', value: index === 0 ? damageClass : <img src={moveClassImage} className='h-[20px] w-[30px]' alt={damageClass} /> },
      { key: 'power', value: power },
      { key: 'accuracy', value: accuracy },
      { key: 'PP', value: PP },
      { key: 'shortEntry', value: shortEntry?.replace('$effect_chance% ', '') },
      { key: 'effectChance', value: effectChance },
    ];
    const tableCells = tableCellData.map(cell => {
      const extraStyling = cell.key === 'shortEntry' ? 'pr-8 w-[48rem]' : 'pl-4'
      // Make a special div for the entry
      const entryDiv = cell.key === 'shortEntry' ? (<div className='w-[36rem]'> { cell.value } </div>) : cell.value
      return (
        <div 
          className={`${headerStyle} ${extraStyling} border-t-[1px] border-gray-500 table-cell h-12 align-middle pl-2 py-2`}
        > 
          { entryDiv }
        </div>
      )
    })
    return (
      <div className='table-row'>
        { tableCells }
      </div>
    )
  }) 

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='mx-4'>
      <TableContainer child={moveTableRows} />
    </motion.div>
  )
}

export default MoveListing