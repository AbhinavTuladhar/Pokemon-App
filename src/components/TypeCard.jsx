import React from 'react'

const TypeCard = ( { typeName }) => {
  const typeMapping = {
    normal: 'yellow-400',
    fire: 'red-500',
    water: 'blue-400',
    electric: 'yellow-300',
    grass: 'green-500',
    ice: 'blue-300',
    fighting: 'red-600',
    poison: 'purple-400',
    ground: 'yellow-600',
    flying: 'indigo-400',
    psychic: 'pink-400',
    bug: 'green-600',
    rock: 'yellow-800',
    ghost: 'purple-600',
    dragon: 'indigo-600',
    dark: 'gray-700',
    steel: 'gray-500',
    fairy: 'pink-300',
  }

  const typeKey = typeName.toLowerCase(); // convert typeName to lowercase
  const backgroundColour = 'bg-' + typeMapping[typeKey]
  const divStyle = `${backgroundColour} p-2 flex justify-center items-center rounded-xl my-4 mx-2`;

  return(
    <div className={divStyle}>
      {typeName.toUpperCase()}
    </div>
  )
}

export default TypeCard;