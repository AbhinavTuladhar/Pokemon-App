import React from 'react'
import { useQueries } from '@tanstack/react-query'
import SectionTitle from './SectionTitle'
import MoveListingSkeleton from './MoveListingSkeleton'
import PokeCardV2 from './PokeCardV2'
import fetchData from '../utils/fetchData'
import { extractPokemonInformation } from '../utils/extractInfo'

const PokemonCardList = ({ title, pokemonUrls }) => {
  const { data: pokemonData = [], isLoading } = useQueries({
    queries: pokemonUrls.map(url => {
      return {
        queryKey: ['pokemon-url', url],
        queryFn: () => fetchData(url),
        staleTime: Infinity,
        cacheTime: Infinity,
        select: data => {
          return extractPokemonInformation(data)
        }
      }
    }),
    combine: results => {
      return {
        data: results.map(result => result.data).sort((first, second) => first?.nationalNumber >= second?.nationalNumber ? 1 : -1),
        isLoading: results.some(result => result.isLoading)
      }
    }
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