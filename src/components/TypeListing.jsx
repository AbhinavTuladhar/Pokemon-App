import { React, useMemo } from 'react'
import TypeCard from './TypeCard'

const TypeListing = () => {
  const typeList = useMemo(() => {
    return [
      'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
    ]
  }, [])

  const typeCardList = typeList.map(type => <TypeCard typeName={type } />)

  return (
    <div className='w-7/12 mx-auto p-4'>
      <h1 className='text-4xl mb-4 font-bold'> These are all the types: </h1>
      <div className='flex flex-row flex-wrap gap-4 justify-center'>
        { typeCardList }
      </div>
    </div>
  )
}

export default TypeListing