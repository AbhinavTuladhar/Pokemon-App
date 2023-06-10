import { React, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import TypeCard from '../components/TypeCard'

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
      className='md:w-3/4 w-full mx-auto p-4'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transitionDuration: '0.5s' }}
      exit={{ opacity: 0, transitionDuration: '0.5s' }}
      transition={{ ease: 'easeIn'}}
    >
      <h1 className='flex text-center justify-center text-4xl mb-10 font-bold'> 
        Type List
      </h1>
      <div className='flex flex-row flex-wrap gap-4 justify-center'>
        { typeCardList }
      </div>
    </motion.div>
  )
}

export default TypeListing