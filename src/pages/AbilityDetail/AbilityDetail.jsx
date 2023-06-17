import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { motion } from 'framer-motion'
import Skeleton from 'react-loading-skeleton'
import AbilityEffect from './AbilityEffect'
import AbilityDescription from './AbilityDescription'
import PokemonList from './PokemonList'
import { extrctAbilityInformation } from '../../utils/extractInfo'
import fetchData from '../../utils/fetchData'
import formatName from '../../utils/NameFormatting'

const AbilityDetail = () => {
  const { id } = useParams()

  // This is for manipulating the api response.
  const transformData = data => {
    return extrctAbilityInformation(data)
  }

  const { data: abilityInfo = []} = useQuery(
    ['abilityDetail', id],
    () => fetchData(`https://pokeapi.co/api/v2/ability/${id}/`),
    { select: transformData, staleTime: Infinity, cacheTime: Infinity }
  )

  // Data to be sent to pokemon listing
  const { pokemon: pokemonList, name } = abilityInfo

  document.title = `${formatName(name)} | Pokémon abilities | Pokémon database`

  return (
    <motion.div
      className='md:mx-10 mx-4'
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1, transitionDuration: '0.8s' }}
      exit={{ y: '100%', opacity: 0, transitionDuration: '0.75s' }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <div className='flex justify-center text-center text-4xl font-bold'>
        {
        abilityInfo.name 
        ?
        `${formatName(abilityInfo.name)} (ability)`
        :
        <Skeleton width='100%' height='2.75rem' containerClassName='flex-1 w-full' />
        }
      </div>
      <div className='flex flex-row flex-wrap gap-x-10 mt-4'>
        <div className='flex flex-col lg:w-475/1000 w-full'> 
          <AbilityEffect entry={abilityInfo.longEntry} />
          <AbilityDescription descriptions={abilityInfo.descriptions} />
        </div>
        <div className='flex flex-col lg:w-475/1000 w-full'> 
          <PokemonList data={{pokemonList, name}}/>
        </div>
      </div>
    </motion.div>
  )
}

export default AbilityDetail