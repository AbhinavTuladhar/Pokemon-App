import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { motion } from 'framer-motion'
import fetchData from '../utils/fetchData'
import MoveData from '../components/MoveDetail/MoveData'
import MachineRecord from '../components/MoveDetail/MachineRecord'
import MoveEffect from '../components/MoveDetail/MoveEffect'
import GameDescription from '../components/MoveDetail/GameDescription'
import { extractMoveInformation } from '../utils/extractInfo'
import formatName from '../utils/NameFormatting'
import PokemonCardList from '../components/MoveDetail/PokemonCardList'


const MoveDetail = () => {
  const { id } = useParams()
  const url = `https://pokeapi.co/api/v2/move/${id}/`

  const transformData = data => {
    const extractedInformation = extractMoveInformation(data)
    return extractedInformation
  }

  const { data: moveInfo = []} = useQuery(
    ['moveData', id],
    () => fetchData(url),
    { select: transformData, staleTime: Infinity, cacheTime: Infinity }
  )

  useEffect(() => {
    console.log('Logging the move details', moveInfo)
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
      <div className='flex flex-row flex-wrap justify-between mt-4'>
        <div className='flex flex-col lg:w-3/12 sm:w-4/12 md:w-4/12 w-full'>
          <MoveData moveInfo={ moveInfo } />
          {
            moveInfo?.machines?.length > 0 &&
            <MachineRecord machineList={ moveInfo.machines} />
          }
        </div>
        <div className='flex flex-col lg:w-8/12 sm:w-7/12 md:w-7/12 w-full'>
          <MoveEffect entry={moveInfo.longEntry} chance={moveInfo.effect_chance} />
          <GameDescription descriptions={moveInfo.descriptions} />
        </div>
      </div>
      <div className='flex flex-col justify-between'>
        <PokemonCardList moveName={moveInfo.moveName} pokemonUrls={moveInfo.pokemonUrls} />
      </div>
    </motion.div>
  )
}

export default MoveDetail