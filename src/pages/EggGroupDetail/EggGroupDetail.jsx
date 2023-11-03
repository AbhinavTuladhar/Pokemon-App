import React from 'react'
import { useParams } from 'react-router-dom'
import fetchData from '../../utils/fetchData'
import { useQuery } from 'react-query'
import formatName from '../../utils/NameFormatting'
import { extractPokemonInformation, extractSpeciesInformation } from '../../utils/extractInfo'
import PokemonTable from './PokemonTable'
import MoveListingSkeleton from '../../components/MoveListingSkeleton'
import { motion } from 'framer-motion'

const EggGroupDetail = () => {
  const { id: eggGroupid } = useParams()

  const { data: eggGroupData } = useQuery(
    ['egg-group', eggGroupid],
    () => fetchData(`https://pokeapi.co/api/v2/egg-group/${eggGroupid}`),
    {
      staleTime: Infinity, cacheTime: Infinity,
      select: fetchedData => {
        const { name: eggGroupName, pokemon_species: pokemonSpecies } = fetchedData
        return { eggGroupName, pokemonSpecies }
      }
    }
  )

  // Geting the species urls
  // const speciesUrls = eggGroupData?.map(obj => obj.pokemonSpecies.url)
  const speciesUrls = eggGroupData?.pokemonSpecies.map(species => species.url)

  // Getting the pokemon Urls
  const pokemonUrls = speciesUrls?.map(url => url.replace('pokemon-species', 'pokemon'))

  // We perform GET requests on all the Pokemon and species urls. Filtering out gen 8+ stuff
  const { data: pokemonData, isLoading: isLoadingPokemonData } = useQuery(
    ['egg-group', eggGroupid, pokemonUrls],
    () => Promise.all(pokemonUrls.map(fetchData)),
    {
      staleTime: Infinity, cacheTime: Infinity,
      select: data => {
        const pokemonInformation = data.map(extractPokemonInformation)
        return pokemonInformation.map(pokemon => {
          const { id, nationalNumber, icon, name, types } = pokemon
          return { id, nationalNumber, icon, name, types }
        })
      }
    }
  )

  const { data: speciesData, isLoading: isLoadingSpeciesData } = useQuery(
    ['egg-group', eggGroupid, speciesUrls],
    () => Promise.all(speciesUrls.map(fetchData)),
    {
      staleTime: Infinity, cacheTime: Infinity,
      select: data => {
        const speciesInformation = data.map(extractSpeciesInformation)
        return speciesInformation.map(species => {
          const { id, egg_groups } = species
          // Find the other egg group
          // For eg if the current page is of the monster egg group
          // and this Pokemon has the 'Water1' egg group, it should get the 'Water1' egg group
          // If there is only one egg group it should return undefined
          const otherEggGroup = egg_groups.map(group => group.name).filter(group => group !== eggGroupid)[0]
          return { id, otherEggGroup }
        })
      }
    }
  )

  // We now need to join the species and pokemon objects on the basis of their ids.
  const finalData = pokemonData?.map(obj1 => {
    const obj2 = speciesData?.find(obj2 => obj1?.id === obj2?.id)
    return { ...obj1, ...obj2 }
  }).filter(entry => (entry.id >= 1 && entry.id <= 807) || (entry.id >= 10001 && entry.id <= 10157))

  return (
    <motion.div
      className='pb-4 mx-4 md:mx-10'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transitionDuration: '0.8s' }}
      exit={{ opacity: 0, transitionDuration: '0.75s' }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <h1 className='text-3xl text-center font-bold my-5'>
        <span> {formatName(eggGroupid)} </span>
        <span className='text-gray-400'> (egg group) </span>
      </h1>
      {isLoadingPokemonData || isLoadingSpeciesData ? (
        <MoveListingSkeleton rowCount={20} />
      ) : (
        <PokemonTable data={finalData} />
      )}
    </motion.div>
  )
}

export default EggGroupDetail