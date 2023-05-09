import React from 'react'

const PokeDexData = ({ pokemonData }) => {
  const { id, types, genus, height, weight, abilities} = pokemonData

  return (
    <>
      {genus}
    </>
  )
}

export default PokeDexData;