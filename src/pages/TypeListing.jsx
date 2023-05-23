import { React, useMemo, useEffect } from 'react'
import TypeCard from '../components/TypeCard'
import { motion } from 'framer-motion'

const TypeListing = () => {
  const typeList = useMemo(() => {
    return [
      'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
    ]
  }, [])

  const typeCardList = typeList.map(type => <TypeCard typeName={type } />)

  useEffect(() => {
    document.title = 'Pokemon Types'
  }, [])

  return (
    <motion.div 
      className='w-7/12 mx-auto p-4'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1 className='text-4xl mb-4 font-bold'> These are all the types: </h1>
      <div className='flex flex-row flex-wrap gap-4 justify-center'>
        { typeCardList }
      </div>
    </motion.div>
  )
}

export default TypeListing