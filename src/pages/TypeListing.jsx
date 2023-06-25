import { React, useMemo } from 'react'
import { motion } from 'framer-motion'
import TypeCard from '../components/TypeCard'

const typeVariant = {
  initial: { y: "5rem", opacity: 0 },
  animate: { 
    y: 0, opacity: 1,
    transition: { staggerChildren: 0.075, ease: "easeOut", duration: 0.3 },
  },
}

const TypeListing = () => {
  const typeList = useMemo(() => {
    return [
      'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
    ]
  }, [])

  const typeCardList = typeList.map(type => (
    <motion.div variants={typeVariant}>
      <TypeCard typeName={type} />
    </motion.div>
  ))

  document.title = 'Pokémon types | Pokémon database'

  return (
    <motion.div 
      className='md:w-3/4 w-full mx-auto p-4'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transitionDuration: '0.5s' }}
      exit={{ opacity: 0, transitionDuration: '0.5s' }}
      transition={{ ease: 'easeIn'}}
    >
      <motion.h1 className='flex text-center justify-center text-4xl mb-10 font-bold' variants={typeVariant}> 
        Type List
      </motion.h1>
      <motion.div className='flex flex-row flex-wrap gap-4 justify-center' variants={typeVariant} initial='initial' animate='animate'>
        { typeCardList }
      </motion.div>
    </motion.div>
  )
}

export default TypeListing