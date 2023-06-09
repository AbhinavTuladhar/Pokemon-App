import React from 'react'
import PokeCardV2 from './PokeCardV2'
import SectionTitle from './SectionTitle'
import { useQuery } from 'react-query'
import fetchData from '../utils/fetchData'
import { extractPokemonInformation } from '../utils/extractInfo'
import MoveListingSkeleton from './MoveListingSkeleton'

const PokemonCardList = ({ title, pokemonUrls }) => {
  const transformData = data => {
    return data.map(obj => extractPokemonInformation(obj))
  }

  const { data: pokemonData = [], isLoading } = useQuery(
    [title, pokemonUrls],
    () => Promise.all(pokemonUrls.map(fetchData)),
    { staleTime: Infinity, cacheTime: Infinity, select: transformData }
  )

  // We now map the Pokemon data into the respective cards.
  const pokeCards = pokemonData?.map(pokemon => <PokeCardV2 pokemonData={pokemon} />)

  return (
    <>
      {
        isLoading
        ?
        <>
          <SectionTitle text='Loading Pokemon data...' />
          <MoveListingSkeleton rowCount={10} />
        </>
        :
        <>
          <SectionTitle text={title} />
          <div className='flex flex-row flex-wrap'>
            { pokeCards }
          </div>
        </>
      }
    </>
  )
}

export default PokemonCardList