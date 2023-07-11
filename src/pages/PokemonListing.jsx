import { React, useMemo, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import 'react-loading-skeleton/dist/skeleton.css'
import PokeCard from '../components/PokeCard'
import PokeCardSkeleton from '../components/PokeCardSkeleton'
import { FadeInAnimationCard } from '../components/AnimatedContainers'

const MainPage = ({ idRange }) => {
  const [pokemonInfo, setPokemonInfo] = useState([])
  const [filteredPokemonInfo, setFilteredPokemonInfo] = useState([]);

  // This is for setting the title of the page.
  const currentLocation = useLocation()
  const generationNumberRaw = currentLocation.pathname.slice(-1)
  // Check for the 'other forms' page.
  const generationNumber = isNaN(generationNumberRaw) ? '' : generationNumberRaw

  const fetchPokemonData = async (url) => {
    const response = await axios.get(url)
    return response.data
  }

  // This fetches the URLs of all the pokemon of that generation.
  const urlList = useMemo(() => {
    let urls = []
    for (let i = idRange[0]; i <= idRange[1]; i++) {
      urls.push(`https://pokeapi.co/api/v2/pokemon/${i}/`)
    }
    return urls
  }, [idRange])

  // Perform a GET request on all the 'calculated' URLs.
  const { data: pokemonData, isLoading } = useQuery(
    ['pokemonData', idRange],
    () => Promise.all(urlList.map(fetchPokemonData)),
    { staleTime: Infinity, cacheTime: Infinity }
  )

  useEffect(() => {
    if (pokemonData?.length > 0) {
      setPokemonInfo(pokemonData)
      setFilteredPokemonInfo(pokemonData);
    }
  }, [pokemonData])

  console.log(filteredPokemonInfo)

  // Map each Pokemon to its respective card.
  const pokemonBoxes = filteredPokemonInfo?.map(pokemon => (
    <FadeInAnimationCard className='smmd:w-2/12 sm:w-1/3 md:w-1/4 w-full my-2 mx-4 py-2'>
      <PokeCard key={pokemon.id} data={pokemon} />
    </FadeInAnimationCard>
  ))

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
      transition={{ ease: 'easeIn'}}
    >
      <div className='flex justify-center items-center'>
        <input 
          className='text-black rounded-xl mx-4 py-2 px-4 w-full lg:w-[20rem]' type='search' 
          placeholder='Search for a Pokemon' 
          disabled={Boolean(isLoading)}
          onChange={handleChange}
        />
      </div>
      {
        isLoading 
        ? 
        <div className='gap-x-2 gap-y-3 px-0 py-4 flex flex-wrap justify-center items-center'>
          <PokeCardSkeleton cardCount={20} />
        </div>
        : 
        <>
          <div className='gap-x-2 gap-y-3 px-0 py-4 flex flex-wrap justify-center items-center'>
            { pokemonBoxes }
          </div>
        </>
      }
    </motion.div>
  )
}

export default MainPage;