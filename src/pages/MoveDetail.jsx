import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import MoveData from '../components/MoveDetail/MoveData'
import MachineRecord from '../components/MoveDetail/MachineRecord'
import MoveEffect from '../components/MoveDetail/MoveEffect'
import GameDescription from '../components/MoveDetail/GameDescription'
import useFetch from '../utils/useFetch'
import { extractMoveInformation } from '../utils/extractInfo'
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

  useEffect(() => {
    if (moveInfo) console.log('Logging extracted information from move detail', moveInfo)
  }, [moveInfo])

  return (
    <motion.div
      className='mx-10'
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1, transitionDuration: '0.8s' }}
      exit={{ y: '100%', opacity: 0, transitionDuration: '0.75s' }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <div className='flex justify-center text-center text-4xl font-bold'>
        { formatName(moveInfo.moveName) } (move)
      </div>
      <div className='flex flex-row flex-wrap gap-x-24 mt-4'>
        <div className='flex flex-col lg:w-1/4 w-full'>
          <MoveData moveInfo={ moveInfo } />
          {
            moveInfo?.machines?.length > 0 &&
            <MachineRecord machineList={ moveInfo.machines} />
          }
        </div>
        <div className='flex flex-col lg:w-2/3 w-full'>
          <MoveEffect entry={moveInfo.longEntry} chance={moveInfo.effect_chance} />
          <GameDescription descriptions={moveInfo.descriptions} />
        </div>
      </div>
    </motion.div>
  )
}

export default MoveDetail