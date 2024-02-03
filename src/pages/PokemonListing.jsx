import { React, useEffect, useState } from 'react'
import { useQueries, useQuery } from '@tanstack/react-query'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import 'react-loading-skeleton/dist/skeleton.css'
import PokeCard from '../components/PokeCard'
import PokeCardSkeleton from '../components/PokeCardSkeleton'
import { FadeInAnimationCard } from '../components/AnimatedContainers'
import fetchData from '../utils/fetchData'

const MainPage = ({ offset, limit }) => {
  const [pokemonInfo, setPokemonInfo] = useState([])
  const [filteredPokemonInfo, setFilteredPokemonInfo] = useState([])

  // This is for setting the title of the page.
  const currentLocation = useLocation()
  const generationNumberRaw = currentLocation.pathname.slice(-1)
  // Check for the 'other forms' page.
  const generationNumber = isNaN(generationNumberRaw) ? '' : generationNumberRaw

  // Construct the url which etches the pokemon urls of that generation
  const listUrl = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

  // Get the pokemon urls using the resource list
  // Moreover, for caching purposes, we replace the number in the url with the actual pokemon name.
  const { data: pokemonUrls, isLoading: isLoadingList } = useQuery({
    queryKey: ['pokemon-list-url', listUrl],
    queryFn: ({ signal }) => fetchData(listUrl, signal),
    cacheTime: Infinity,
    staleTime: Infinity,
    select: (data) => {
      const pokemonList = data.results
      return pokemonList.map((pokemon) => {
        const { name, url } = pokemon
        const replacedUrl = url.replace(/\/pokemon\/\d+\//, `/pokemon/${name}/`)
        return replacedUrl
      })
    },
  })

  const {
    data: pokemonData,
    isLoading,
    isFullyLoaded,
  } = useQueries({
    queries: pokemonUrls
      ? pokemonUrls.map((url) => {
          return {
            queryKey: ['pokemon-url', url],
            queryFn: ({ signal }) => fetchData(url, signal),
            cacheTime: Infinity,
            staleTime: Infinity,
          }
        })
      : [],
    combine: (results) => {
      return {
        data: results?.map((result) => result?.data),
        isLoading: results.some((result) => result.isLoading),
        isFullyLoaded: results.every((result) => result.data !== undefined),
      }
    },
  })

  useEffect(() => {
    if (pokemonData?.length > 0) {
      setPokemonInfo(pokemonData)
      setFilteredPokemonInfo(pokemonData)
    }
  }, [pokemonData])

  // For handling the search bar.
  const handleChange = (event) => {
    const searchString = event.target.value
    const filteredData = pokemonInfo?.filter((pokemon) =>
      pokemon.name.includes(searchString.toLowerCase()),
    )
    setFilteredPokemonInfo(filteredData)
  }

  const titleSuffix = 'List | Pokémon database'
  const titlePrefix =
    generationNumber !== '' ? `Generation ${generationNumber} Pokémon` : 'Pokémon forms'
  document.title = `${titlePrefix} ${titleSuffix}`

  return (
    <motion.div
      initial={{ x: '-100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1, transitionDuration: '0.3s' }}
      exit={{ x: '100%', opacity: 0, transitionDuration: '0.5s' }}
      transition={{ ease: 'easeIn' }}
    >
      <div className="flex items-center justify-center">
        <input
          className="text-black rounded-xl mx-4 py-2 px-4 w-full md:w-[20rem]"
          type="search"
          placeholder="Search for a Pokemon"
          disabled={Boolean(isLoading) || Boolean(isLoadingList)}
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-8 px-0 py-4 mt-2">
        {!isFullyLoaded || isLoadingList ? (
          <PokeCardSkeleton cardCount={20} />
        ) : (
          filteredPokemonInfo?.map((pokemon, index) => (
            <FadeInAnimationCard key={index}>
              <PokeCard data={pokemon} />
            </FadeInAnimationCard>
          ))
        )}
      </div>
    </motion.div>
  )
}

export default MainPage
