import { React, useMemo, useEffect } from 'react'
import axios from 'axios'
import { useQuery } from 'react-query'
import { useLocation } from 'react-router-dom'
import PokeCard from '../components/PokeCard'
import { motion } from 'framer-motion'

const MainPage = ({ idRange }) => {
  // This is for setting the title of the page.
  const currentLocation = useLocation()
  const generationNumber = currentLocation.pathname.slice(-1)

  useEffect(() => {
    document.title = `Gen ${generationNumber}`
  }, [generationNumber])

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

  // Map each Pokemon to its respective card.
  const pokemonBoxes = pokemonData?.map(pokemon => <PokeCard key={pokemon.id} data={pokemon} />)

  // Text to display when the data is not available.
  const loadingText = (
    <div className='flex text-center justify-center items-center text-5xl'> 
      Loading...
    </div>)

  return (
    <motion.div 
      className='gap-x-2 gap-y-3 px-0 py-4 flex flex-wrap justify-center items-center'
      initial={{ x: '-100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1, transitionDuration: '0.3s' }}
      exit={{ x: '100%', opacity: 0, transitionDuration: '0.5s' }}
      transition={{ ease: 'easeIn'}}
    >
      {isLoading ? loadingText : pokemonBoxes}
    </motion.div>
  )
}

export default MainPage;