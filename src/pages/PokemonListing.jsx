import { React, useMemo, useEffect, useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import 'react-loading-skeleton/dist/skeleton.css'
import PokeCard from '../components/PokeCard'
import PokeCardSkeleton from '../components/PokeCardSkeleton'
import { FadeInAnimationCard } from '../components/AnimatedContainers'
import fetchData from '../utils/fetchData'

const MainPage = ({ idRange }) => {
  const [pokemonInfo, setPokemonInfo] = useState([])
  const [filteredPokemonInfo, setFilteredPokemonInfo] = useState([]);

  // This is for setting the title of the page.
  const currentLocation = useLocation()
  const generationNumberRaw = currentLocation.pathname.slice(-1)
  // Check for the 'other forms' page.
  const generationNumber = isNaN(generationNumberRaw) ? '' : generationNumberRaw

  // This fetches the URLs of all the pokemon of that generation.
  const urlList = useMemo(() => {
    let urls = []
    for (let i = idRange[0]; i <= idRange[1]; i++) {
      urls.push(`https://pokeapi.co/api/v2/pokemon/${i}/`)
    }
    return urls
  }, [idRange])

  const { data: pokemonData, isLoading, isFullyLoaded } = useQueries({
    queries: urlList.map(url => {
      return {
        queryKey: ['pokemon-url', url],
        queryFn: () => fetchData(url),
        cacheTime: Infinity,
        staleTime: Infinity,
      }
    }),
    combine: results => {
      return {
        data: results?.map(result => result?.data),
        isLoading: results.some(result => result.isLoading),
        isFullyLoaded: results.every(result => result.data !== undefined)
      }
    }
  })

  useEffect(() => {
    if (pokemonData?.length > 0) {
      setPokemonInfo(pokemonData)
      setFilteredPokemonInfo(pokemonData);
    }
  }, [pokemonData])

  // For handling the search bar.
  const handleChange = event => {
    const searchString = event.target.value
    const filteredData = pokemonInfo?.filter(pokemon => pokemon.name.includes(searchString.toLowerCase()))
    setFilteredPokemonInfo(filteredData);
  }

  const titleSuffix = 'List | Pokémon database'
  const titlePrefix = generationNumber !== '' ? `Generation ${generationNumber} Pokémon` : 'Pokémon forms'
  document.title = `${titlePrefix} ${titleSuffix}`

  return (
    <motion.div
      initial={{ x: '-100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1, transitionDuration: '0.3s' }}
      exit={{ x: '100%', opacity: 0, transitionDuration: '0.5s' }}
      transition={{ ease: 'easeIn' }}
    >
      <div className='flex items-center justify-center'>
        <input
          className='text-black rounded-xl mx-4 py-2 px-4 w-full md:w-[20rem]' type='search'
          placeholder='Search for a Pokemon'
          disabled={Boolean(isLoading)}
          onChange={handleChange}
        />
      </div>
      <div className='flex flex-wrap items-center justify-center gap-8 px-0 py-4 mt-2'>
        {!isFullyLoaded ? (
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

export default MainPage;