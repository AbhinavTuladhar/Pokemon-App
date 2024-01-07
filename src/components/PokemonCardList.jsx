import React from 'react'
import { useQueries } from '@tanstack/react-query'
import SectionTitle from './SectionTitle'
import PokeCardV2 from './PokeCardV2'
import PokeCardV2Skeleton from './PokeCardV2Skeleton'
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
          <div className='grid grid-cols-card-list gap-x-3 gap-y-6'>
            {Array(pokemonUrls.length).fill(0).map((_, index) => (
              <PokeCardV2Skeleton key={index} />
            ))}
          </div>
        </>
      ) : (
        <>
          <SectionTitle text={title} />
          <div className='grid grid-cols-card-list gap-x-3 gap-y-6'>
            {pokeCards}
          </div>
        </>
      )}
    </>
  )
}

export default PokemonCardList