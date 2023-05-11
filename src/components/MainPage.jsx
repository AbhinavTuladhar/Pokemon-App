import { React, useMemo, useEffect } from 'react'
import axios from 'axios'
import { useQuery } from 'react-query'
import { useLocation } from 'react-router-dom'
import PokeCard from './PokeCard'

const MainPage = ({ idRange }) => {
  const currentLocation = useLocation()
  const generationNumber = currentLocation.pathname.slice(-1)

  useEffect(() => {
    document.title = `Gen ${generationNumber}`
  }, [currentLocation])

  const fetchPokemonData = async (url) => {
    const response = await axios.get(url)
    return response.data
  }

  const urlList = useMemo(() => {
    let urls = []
    for (let i = idRange[0]; i <= idRange[1]; i++) {
      urls.push(`https://pokeapi.co/api/v2/pokemon/${i}/`)
    }
    return urls
  }, [idRange])

  const { data: pokemonData, isLoading } = useQuery(
    ['pokemonData', idRange],
    () => Promise.all(urlList.map(fetchPokemonData)),
    { staleTime: Infinity }
  )

  const pokemonBoxes = pokemonData?.map(pokemon => <PokeCard key={pokemon.id} data={pokemon} />)

  const loadingText = (
    <div className='justify-center items-center text-5xl'> 
      Please wait, data is loading... 
    </div>)

  return (
    <div className='gap-x-2 gap-y-3 px-2 py-4 flex flex-wrap justify-center items-center flex-grow'>
      {isLoading ? loadingText : pokemonBoxes}
    </div>
  )
}

export default MainPage;