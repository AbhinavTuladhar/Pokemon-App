import React from 'react'
import { motion } from 'framer-motion'

const FadeInAnimationContainer = ({ children }) => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeIn' }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false }}
    >
      { children }
    </motion.section>
  )
} 

export { FadeInAnimationContainer }