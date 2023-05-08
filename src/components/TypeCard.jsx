import React from 'react'

const TypeCard = ( { typeName }) => {
  const typeMapping = {
    normal: 'yellow-500',
    fire: 'red-500',
    water: 'blue-500',
    electric: 'yellow-400',
    grass: 'green-500',
    ice: 'blue-200',
    fighting: 'red-700',
    poison: 'purple-500',
    ground: 'yellow-600',
    flying: 'indigo-500',
    psychic: 'pink-500',
    bug: 'green-700',
    rock: 'yellow-800',
    ghost: 'purple-700',
    dragon: 'indigo-700',
    dark: 'gray-800',
    steel: 'gray-400',
    fairy: 'pink-300',
  }

  const divStyle = `bg-${typeMapping[typeName]} p-2 flex justify-center items-center rounded-xl my-4 mx-2`

  if (typeName === 'ice')
    console.log(divStyle)

  return(
    <div className={`${divStyle}`}>
      {typeName.toUpperCase()}
    </div>
  )
}

export default TypeCard;