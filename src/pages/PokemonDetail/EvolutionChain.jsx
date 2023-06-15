import React from 'react'
import { useQuery } from 'react-query'
import { BsArrowRight } from 'react-icons/bs'
import Skeleton from 'react-loading-skeleton'
import fetchData from '../../utils/fetchData'
import { extractPokemonInformation } from '../../utils/extractInfo'
import formatName from '../../utils/NameFormatting'
import SectionTitle from '../../components/SectionTitle'


// A function to find all the keys of an object that are not null, false or ''
function nonNullValues(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => value !== null && value !== false && value !== '')
  )
}

const EvolutionChain = ({ url }) => {
  const { data: evolutionData, isLoading } = useQuery(
    [url],
    () => fetchData(url),
    { staleTime: Infinity, cacheTime: Infinity }
  )

  // Use a recursive function to fetch the data of all the pokemon within the evolution chain.
  const getAllData = () => {
    const information = []

    const traverseChain = chain => {
      const {
        evolution_details,
        evolves_to: evolvesTo,
        species : { name: speciesName = '', url: speciesUrl = '' }
      } = chain || {}
  
      const evoDetailsNew = evolution_details.map(nonNullValues) || []
  
      information.push({
        evolutionDetails: evoDetailsNew,
        speciesName,
        speciesUrl,
        nextEvoSplit: evolvesTo.length > 1
      })
  
      if (evolvesTo.length > 0) {
        evolvesTo.forEach(evolution => {
          traverseChain(evolution)
        })
      }
    }
    if (evolutionData?.chain) {
      traverseChain(evolutionData.chain);
    }
    return information
  }

  const evolutionChainData = getAllData()
  
  // Find the urls of all the pokemon in the evolution chain.
  // Find the Pokemon Url, NOT the species url.
  const pokemonUrls = evolutionChainData.map(pokemon => {
    const speciesUrl = pokemon.speciesUrl
    const idNumber = parseInt(speciesUrl.match(/\/(\d+)\/$/)[1])
    return `https://pokeapi.co/api/v2/pokemon/${idNumber}/`
  })

  // Then perform a get request on all this data, then get the home sprite, and name of the pokemon.
  const { data: allPokemonData, isLoading: isLoadingPokemonData } = useQuery(
    pokemonUrls,
    () => Promise.all(pokemonUrls.map(fetchData)),
    { 
      staleTime: Infinity,
      cacheTime: Infinity, 
      select: pokemonDataList => {
        return pokemonDataList.map(pokemon => {
          const extractedInformation = extractPokemonInformation(pokemon)
          const { name, homeSprite } = extractedInformation
          return { name, homeSprite }
        })
      }
    }
  )

  // Now perform a join operation on allPokemonData and evolutionChainData on the basis of the pokemon name.
  const finalPokemonData = allPokemonData?.map(pokemon => {
    const species = evolutionChainData?.find(species => species.speciesName === pokemon.name)
    return { ...pokemon, ...species }
  })

  // Define divs for each pokemon in the evolution chain.
  const individualPokemon = finalPokemonData?.map((pokemon) => {
    return (
      <div className='flex flex-col items-center'>
        <img src={pokemon.homeSprite} alt={pokemon} className='h-[160px]' />
        { formatName(pokemon.name) }
      </div>
    )
  })

  const finalEvolutionDiv = individualPokemon?.map((pokemon, index) => {
    return (
      <div className='flex justify-center items-center gap-x-10'>
        { pokemon }
        { index !== individualPokemon.length - 1 && <BsArrowRight size={60} /> }
      </div>
    )
  })

  return (
    <>
      <SectionTitle text='Evolution Chart' />
      <div className='flex flex-row justify-center gap-x-10'>
        {
          isLoading || isLoadingPokemonData
          ?
          <Skeleton width='100%' height='12rem' containerClassName='flex-1 w-full' />
          :
          finalEvolutionDiv
        }
      </div>
    </>
  )
}

export default EvolutionChain