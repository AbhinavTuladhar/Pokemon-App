import { React, useMemo, useEffect } from 'react'
import { useQuery } from 'react-query'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import PokeCard from '../components/PokeCard'
import PokeCardSkeleton from '../components/PokeCardSkeleton'

const MainPage = ({ idRange }) => {
  // This is for setting the title of the page.
  const currentLocation = useLocation()
  const generationNumberRaw = currentLocation.pathname.slice(-1)
  // Check for the 'other forms' page.
  const generationNumber = isNaN(generationNumberRaw) ? '' : generationNumberRaw

  // Find the number of Pokemon in the page for skeleton.
  const pokemonCount = idRange[1] - idRange[0]

  useEffect(() => {
    document.title = generationNumber !== '' ? `Gen ${generationNumber}` : 'Pokemon forms'
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
      initial={{ x: '-100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1, transitionDuration: '0.3s' }}
      exit={{ x: '100%', opacity: 0, transitionDuration: '0.5s' }}
      transition={{ ease: 'easeIn'}}
    >
      {
        isLoading 
        ? 
        <div className='gap-x-2 px-0 py-4 flex flex-wrap justify-center items-center'>
          <PokeCardSkeleton cardCount={20} />
        </div>
        : 
        <>
          {/* <div className='flex text-5xl font-bold justify-center'>
            {
              generationNumber !== '' 
              ? 
              `Generation ${generationNumber} Pokemon` 
              : 
              'Pokemon forms'
            }
          </div> */}
          <div className='gap-x-2 gap-y-3 px-0 py-4 flex flex-wrap justify-center items-center'>
            { pokemonBoxes }
          </div>
        </>
      }
    </motion.div>
  )
}

export default MainPage;