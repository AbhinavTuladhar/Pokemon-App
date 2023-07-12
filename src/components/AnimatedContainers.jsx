import React from 'react'
import { motion } from 'framer-motion'

const FadeInAnimationContainer = ({ children, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeIn', staggerChildren: 0.2, delayChildren: 0.4 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false }}
      className={`${className}`}
    >
      { children }
    </motion.div>
  )
} 

// An exclusive animated div for PokemonCard
const FadeInAnimationCard = ({ children, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeIn' }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false }}
      className={`${className}`}
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
      initial={{ opacity: 0, y: '1rem' }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${className}`}
      viewport={{ once: animateOnce }}
    >
      { children }
    </motion.div>
  )
}

const FadeInAnimatedTableRowContainer = ({ children, className, useOnce }) => {
  const animateOnce = useOnce ? true : false
  return (
    <motion.div
      initial={{ opacity: 0}}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`${className}`}
      viewport={{ once: animateOnce }}
    >
      { children }
    </motion.div>
  )
}

export { FadeInAnimationContainer, FadeInAnimationCard, AnimatedTableRowContainer, FadeInAnimatedTableRowContainer }