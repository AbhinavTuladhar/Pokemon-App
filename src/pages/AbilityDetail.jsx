import React from 'react'
import { useParams } from 'react-router-dom'
import { extrctAbilityInformation } from '../utils/extractInfo'
import formatName from '../utils/NameFormatting'
import { motion } from 'framer-motion'
import AbilityEffect from '../components/AbilityDetail/AbilityEffect'
import AbilityDescription from '../components/AbilityDetail/AbilityDescription'
import PokemonList from '../components/AbilityDetail/PokemonList'
import fetchData from '../utils/fetchData'
import { useQuery } from 'react-query'

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

  return (
    <motion.div
      className='md:mx-10 mx-4'
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1, transitionDuration: '0.8s' }}
      exit={{ y: '100%', opacity: 0, transitionDuration: '0.75s' }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <div className='flex justify-center text-center text-4xl font-bold'>
        { formatName(abilityInfo.name) } (ability)
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