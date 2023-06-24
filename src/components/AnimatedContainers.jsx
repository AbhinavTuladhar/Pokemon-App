import React from 'react'
import { motion } from 'framer-motion'

const FadeInAnimationContainer = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeIn', staggerChildren: 0.2, delayChildren: 0.4 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false }}
    >
      { children }
    </motion.div>
  )
} 

// An exclusive animated div for PokemonCard
const FadeInAnimationCard = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeIn' }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false }}
      className='smmd:w-2/12 sm:w-1/3 md:w-1/4 w-full my-2 mx-4 py-2'
    >
      { children }
    </motion.div>
  )
} 

// This is for the table rows.
const AnimatedTableRowContainer = ({ children, className, useOnce }) => {
  const animateOnce = useOnce ? true : false
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${className}`}
      viewport={{ once: animateOnce }}
    >
      { children }
    </motion.div>
  )
}

export { FadeInAnimationContainer, FadeInAnimationCard, AnimatedTableRowContainer }