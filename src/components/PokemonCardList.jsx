import React from 'react'
import { useQuery } from '@tanstack/react-query'
import SectionTitle from './SectionTitle'
import MoveListingSkeleton from './MoveListingSkeleton'
import PokeCardV2 from './PokeCardV2'
import fetchData from '../utils/fetchData'
import { extractPokemonInformation } from '../utils/extractInfo'

const PokemonCardList = ({ title, pokemonUrls }) => {
  const transformData = data => {
    return data
      .map(obj => extractPokemonInformation(obj))
      .sort((first, second) => first.nationalNumber >= second.nationalNumber ? 1 : -1)
  }

  const { data: pokemonData = [], isLoading } = useQuery({
    queryKey: [title, pokemonUrls],
    queryFn: () => Promise.all(pokemonUrls.map(fetchData)),
    staleTime: Infinity,
    cacheTime: Infinity,
    select: transformData
  })

  // We now map the Pokemon data into the respective cards.
  const pokeCards = pokemonData?.map((pokemon, index) => (
    <PokeCardV2 pokemonData={pokemon} key={index} />
  ))

  return (
    <>
      {isLoading ? (
        <>
          <SectionTitle text='Loading Pokemon data...' />
          <MoveListingSkeleton rowCount={10} />
        </>
      ) : (
        <>
          <SectionTitle text={title} />
          <div className='flex flex-row flex-wrap'>
            {pokeCards}
          </div>
        </>
      )}
    </>
  )
}

export default PokemonCardList