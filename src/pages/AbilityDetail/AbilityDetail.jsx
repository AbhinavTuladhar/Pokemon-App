import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import Skeleton from 'react-loading-skeleton'
import AbilityEffect from './AbilityEffect'
import AbilityDescription from './AbilityDescription'
import PokemonList from './PokemonList'
import { extractAbilityInformation } from '../../utils/extractInfo'
import fetchData from '../../utils/fetchData'
import formatName from '../../utils/NameFormatting'

const AbilityDetail = () => {
  const { id } = useParams()

  const url = `https://pokeapi.co/api/v2/ability/${id}/`

  // This is for manipulating the api response.
  const transformData = (data) => {
    return extractAbilityInformation(data)
  }

  const { data: abilityInfo = [] } = useQuery({
    queryKey: ['ability-url', url],
    queryFn: ({ signal }) => fetchData(url, signal),
    select: transformData,
    staleTime: Infinity,
    cacheTime: Infinity,
  })

  // Data to be sent to pokemon listing
  const { pokemon: pokemonList, name } = abilityInfo

  document.title = `${formatName(name)} | Pokémon abilities | Pokémon database`

  return (
    <motion.div
      initial={{ x: '-10rem', opacity: 0 }}
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
        {abilityInfo.name ? (
          `${formatName(abilityInfo.name)} (ability)`
        ) : (
          <Skeleton width="100%" height="2.75rem" containerClassName="flex-1 w-full" />
        )}
      </div>
      <div className="mt-4 flex flex-row flex-wrap gap-x-10">
        <div className="flex w-full flex-col lg:w-475/1000">
          <AbilityEffect entry={abilityInfo.longEntry} />
          <AbilityDescription descriptions={abilityInfo.descriptions} />
        </div>
        <div className="flex w-full flex-col lg:w-475/1000">
          <PokemonList data={{ pokemonList, name }} />
        </div>
      </div>
    </motion.div>
  )
}

export default AbilityDetail
