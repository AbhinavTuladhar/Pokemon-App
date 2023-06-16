import React from 'react'
import { useQuery } from 'react-query'
import { NavLink } from 'react-router-dom'
import { BsArrowRight, BsArrowDown } from 'react-icons/bs'
import Skeleton from 'react-loading-skeleton'
import TypeCard from '../../components/TypeCard'
import fetchData from '../../utils/fetchData'
import { extractPokemonInformation } from '../../utils/extractInfo'
import formatName from '../../utils/NameFormatting'
import SectionTitle from '../../components/SectionTitle'
import evolutionStringFinder from '../../utils/evolutionStringFinder'


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
          const { name, homeSprite, id, types } = extractedInformation
          return { name, homeSprite, id, types }
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
    const { homeSprite, name, id, types } = pokemon
    const typeDiv = types.map((type, index) => {
      const typeName = type.type.name
      return (
        <>
          <TypeCard typeName={typeName} useTextOnly={true} />
          {index !== types.length - 1 && <span> · </span>}
        </>
      )
    })

    // For the identifying number
    const formattedId = `#${('00' + id).slice(-3)}`

    return (
      <div className='flex flex-row sm:flex-row md:flex-col justify-center items-center gap-y-2'>
        <img src={homeSprite} alt={name} className='h-40 aspect-square' />
        <div className='flex flex-col items-center justify-center'>
          { formattedId }
          <NavLink 
            to={`/pokemon/${id}`} 
            className='text-blue-500 font-bold text-md hover:text-red-500 hover:underline duration-500'
          > 
            { formatName(name) }
          </NavLink>
          <span className='text-center'>
            { typeDiv }
          </span>
        </div>
      </div>
    )
  })

  const finalEvolutionDiv = individualPokemon?.map((pokemon, index) => {
    const pokemonData = finalPokemonData[(index + 1) % individualPokemon.length]

    const { evolutionDetails } = pokemonData

    const evolutionExtractedInfo = evolutionStringFinder(evolutionDetails)

    const [firstElement] = evolutionDetails || []
    const { min_level: triggerLevel } = firstElement || {}

    return (
      <div className='flex flex-col md:flex-row sm:flex-col justify-center items-center'>
        { pokemon }
        { 
          index !== individualPokemon.length - 1 && 
          (
            <>
              <div className='md:flex flex-col sm:hidden text-center hidden justify-center items-center w-28'>
                <BsArrowRight size={60} className='mx-4' />
                { `(${evolutionExtractedInfo})` }
              </div>
              <div className='md:hidden sm:flex text-center flex flex-col justify-center items-center w-28'>
                <BsArrowDown size={60} className='my-2' />
                { `(${evolutionExtractedInfo})` }
              </div>
            </>
          )
        }
      </div>
    )
  })

  return (
    <>
      <SectionTitle text='Evolution Chart' />
      <div className='flex flex-col md:flex-row sm:flex-col justify-center gap-x-5'>
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