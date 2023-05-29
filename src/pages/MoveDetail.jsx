import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import MoveData from '../components/MoveDetail/MoveData'
import useFetch from '../utils/useFetch'
import extractMoveInformation from '../utils/extractMoveInfo'
import formatName from '../utils/NameFormatting'

const MoveDetail = () => {
  const { id } = useParams()
  const [ moveInfo, setMoveInfo ] = useState([])

  const url = `https://pokeapi.co/api/v2/move/${id}/`

  const { data: moveData } = useFetch(url)

  useEffect(() => {
    if (moveData.length === 0) 
      return
    const extractedInformation = extractMoveInformation(moveData)
    console.log('Logging moveData', moveData)
    setMoveInfo(extractedInformation)
  }, [moveData])

  return (
    <motion.div
      className='mx-4'
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1, transitionDuration: '0.8s' }}
      exit={{ y: '100%', opacity: 0, transitionDuration: '0.75s' }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <div className='flex justify-center text-4xl font-bold'>
        { formatName(moveInfo.moveName) }&nbsp;
        <span className='brightness-90'>
          (move)
        </span>
      </div>
      <MoveData moveInfo={ moveInfo } />
    </motion.div>
  )
}

export default MoveDetail