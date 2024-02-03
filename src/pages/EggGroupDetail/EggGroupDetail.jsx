import React from 'react'
import { useParams } from 'react-router-dom'
import fetchData from '../../utils/fetchData'
import { useQueries, useQuery } from '@tanstack/react-query'
import formatName from '../../utils/NameFormatting'
import { extractPokemonInformation, extractSpeciesInformation } from '../../utils/extractInfo'
import PokemonTable from './PokemonTable'
import GroupList from './GroupList'
import { motion } from 'framer-motion'
import { FadeInAnimationContainer } from '../../components/AnimatedContainers'

const EggGroupDetail = () => {
  const { id: eggGroupid } = useParams()

  const { data: eggGroupData } = useQuery({
    queryKey: ['egg-group', eggGroupid],
    queryFn: () => fetchData(`https://pokeapi.co/api/v2/egg-group/${eggGroupid}`),
    staleTime: Infinity,
    cacheTime: Infinity,
    select: (fetchedData) => {
      const { name: eggGroupName, pokemon_species: pokemonSpecies } = fetchedData
      return { eggGroupName, pokemonSpecies }
    },
  })

  // Geting the species urls
  // const speciesUrls = eggGroupData?.map(obj => obj.pokemonSpecies.url)
  const speciesUrls = eggGroupData?.pokemonSpecies.map((species) => species.url)

  // Getting the pokemon Urls
  const pokemonUrls = speciesUrls?.map((url) => url.replace('pokemon-species', 'pokemon'))

  // We perform GET requests on all the Pokemon and species urls. Filtering out gen 8+ stuff
  const { data: pokemonData, isLoading: isLoadingPokemonData } = useQueries({
    queries: pokemonUrls
      ? pokemonUrls.map((url) => {
          return {
            queryKey: ['pokemon-url', url],
            queryFn: ({ signal }) => fetchData(url, signal),
            staleTime: Infinity,
            cacheTime: Infinity,
            select: (data) => {
              const pokemonInformation = extractPokemonInformation(data)
              const { id, nationalNumber, icon, name, types } = pokemonInformation
              return { id, nationalNumber, icon, name, types }
            },
          }
        })
      : [],
    combine: (results) => {
      return {
        data: results.map((result) => result.data),
        isLoading: results.some((result) => result.isLoading),
      }
    },
  })

  const { data: speciesData, isLoading: isLoadingSpeciesData } = useQueries({
    queries: speciesUrls
      ? speciesUrls.map((url) => {
          return {
            queryKey: ['species-url', url],
            queryFn: ({ signal }) => fetchData(url, signal),
            staleTime: Infinity,
            cacheTime: Infinity,
            select: (data) => {
              const speciesInformation = extractSpeciesInformation(data)
              const { id, egg_groups } = speciesInformation
              // Find the other egg group
              // For eg if the current page is of the monster egg group
              // and this Pokemon has the 'Water1' egg group, it should get the 'Water1' egg group
              // If there is only one egg group it should return undefined
              const otherEggGroup = egg_groups
                .map((group) => group.name)
                .filter((group) => group !== eggGroupid)[0]
              return { id, otherEggGroup }
            },
          }
        })
      : [],
    combine: (results) => {
      return {
        data: results.map((result) => result.data),
        isLoading: results.some((result) => result.isLoading),
      }
    },
  })

  // We now need to join the species and pokemon objects on the basis of their ids.
  const finalData = pokemonData
    ?.map((obj1) => {
      const obj2 = speciesData?.find((obj2) => obj1?.id === obj2?.id)
      return { ...obj1, ...obj2 }
    })
    .filter(
      (entry) => (entry.id >= 1 && entry.id <= 807) || (entry.id >= 10001 && entry.id <= 10157),
    )

  document.title = `${formatName(eggGroupid)} egg group | Pokémon database`

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transitionDuration: '0.8s' }}
      exit={{ opacity: 0, transitionDuration: '0.75s' }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <h1 className="my-5 text-3xl font-bold text-center">
        <span> {formatName(eggGroupid)} </span>
        <span className="text-gray-400"> (egg group) </span>
      </h1>
      <div className="flex flex-row flex-wrap gap-10">
        <FadeInAnimationContainer className="w-full lg:w-1/3">
          <GroupList />
        </FadeInAnimationContainer>
        <div className="flex justify-center w-full lg:w-5/12">
          <FadeInAnimationContainer className="w-full">
            <PokemonTable
              data={finalData}
              isLoading={isLoadingPokemonData || isLoadingSpeciesData}
            />
          </FadeInAnimationContainer>
        </div>
      </div>
    </motion.div>
  )
}

export default EggGroupDetail
