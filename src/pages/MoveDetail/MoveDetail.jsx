import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import PokemonCardList from '../../components/PokemonCardList'
import MoveData from './MoveData'
import MachineRecord from './MachineRecord'
import MoveEffect from './MoveEffect'
import GameDescription from './GameDescription'
import { extractMoveInformation } from '../../utils/extractInfo'
import formatName from '../../utils/NameFormatting'
import fetchData from '../../utils/fetchData'
import MoveTarget from './MoveTarget'
import OtherLanguages from './OtherLanguages'
import Skeleton from 'react-loading-skeleton'

const MoveDetail = () => {
  const { id } = useParams()
  const url = `https://pokeapi.co/api/v2/move/${id}/`

  const transformData = (data) => {
    const extractedInformation = extractMoveInformation(data)
    return extractedInformation
  }

  const { data: moveInfo = [] } = useQuery({
    queryKey: ['move-url', url],
    queryFn: ({ signal }) => fetchData(url, signal),
    select: transformData,
    staleTime: Infinity,
    cacheTime: Infinity,
  })

  // Set the document title
  const { moveName, names } = moveInfo
  document.title = `${formatName(moveName)} | Pokémon Moves | Pokémon Database`

  return (
    <motion.div
      initial={{ x: '-5rem', opacity: 0 }}
      animate={{
        x: 0,
        opacity: 1,
        transitionDuration: '0.8s',
        transitionTimingFunction: 'ease-out',
      }}
      exit={{
        x: '100%',
        opacity: 0,
        transitionDuration: '0.8s',
        transitionTimingFunction: 'ease-in',
      }}
    >
      <div className="flex justify-center text-center text-4xl font-bold">
        {moveInfo.moveName ? (
          `${formatName(moveInfo.moveName)} (move)`
        ) : (
          <Skeleton width="100%" height="2.75rem" containerClassName="flex-1 w-full" />
        )}
      </div>

      <div className="mt-4 flex flex-row flex-wrap gap-x-4 lg:gap-x-8">
        <div className="flex w-full grow-0 flex-col md:w-auto md:grow-[2] md:basis-0">
          <MoveData moveInfo={moveInfo} />
          {moveInfo?.machines?.length > 0 && <MachineRecord machineList={moveInfo.machines} />}
        </div>
        <div className="w-full grow-0 basis-full md:w-auto md:grow-[6] md:basis-0">
          <MoveEffect entry={moveInfo.longEntry} chance={moveInfo.effect_chance} />
        </div>
      </div>

      <div className="flex flex-row flex-wrap gap-x-10 md:mt-2 lg:gap-x-16">
        <div className="w-full grow-0 md:w-auto md:grow md:basis-0">
          <MoveTarget targetType={moveInfo.targetType} />
          <OtherLanguages names={names} />
        </div>
        <div className="w-full grow-0 basis-full md:w-auto md:grow-[3] md:basis-0">
          <GameDescription descriptions={moveInfo.descriptions} />
        </div>
      </div>

      <div className="flex flex-col justify-between">
        {moveInfo?.pokemonUrls?.length > 0 && (
          <PokemonCardList
            title={`Pokemon that can learn ${formatName(moveInfo.moveName)}`}
            pokemonUrls={moveInfo.pokemonUrls}
          />
        )}
      </div>
    </motion.div>
  )
}

export default MoveDetail
