import React from 'react'
import { useQuery } from 'react-query'
import { NavLink } from 'react-router-dom'
import OneLineSkeleton from '../../components/OneLineSkeleton'
import fetchData from '../../utils/fetchData'
import formatName from '../../utils/NameFormatting'

const AdjacentLinks = ({ id }) => {
  const offsetValue = id !== 1 ? id - 2 : 0
  const url = `https://pokeapi.co/api/v2/pokemon?limit=3&offset=${offsetValue}`

  const transformData = data => {
    const { results } = data
    // Get the Pokemon to the left and right of the current Pokemon.
    const [previousPokemon, ...rest] = results
    const nextPokemon = id !== 1 ? results[results.length - 1] : rest[0]

    // Check for the pokemon which have the first and last id values
    const linkedPokemon = id === 1 ? [nextPokemon] : [previousPokemon, nextPokemon]

    return linkedPokemon.map((pokemon, index) => {
      const { name } = pokemon
      const indexOffset = index === 0 ? index - 1 : index
      const idNumber = id === 1 ? 2 : id + indexOffset
      // append zeroes to the left of idNumber
      const formattedId = '#' + `00${idNumber}`.slice(-3)
      return {
        id: idNumber,
        formattedId,
        name
      }
    })
  }

  const { data: adjacentData = {}, isLoading } = useQuery(
    ['adjacentData', offsetValue],
    () => fetchData(url),
    { staleTime: Infinity, cacheTime: Infinity, select: transformData }
  )

  console.log(adjacentData)
    
  // Skip rendering for pokemon forms.
  if (id >= 10_000) {
    return
  }

  if (isLoading) {
    return <OneLineSkeleton />
  }

  const alignment = id !== 1 ? 'justify-between' : 'justify-end'

  return (
    <div className={`flex my-4 ${alignment}`}>
      {adjacentData.map((pokemon, index) => {
        const { id: linkId, name, formattedId } = pokemon
        const leftPart = index === 0 && id !== 1 ? '←' : ''
        const rightPart = index !== 0 || id === 1 ? '→' : ''
        return (
          <NavLink to={`/pokemon/${linkId}`} className='hoverable-link'>
            {`${leftPart} ${formattedId} ${formatName(name)} ${rightPart}`}
          </NavLink>
        )
      })}
    </div>
  )
}

export default AdjacentLinks