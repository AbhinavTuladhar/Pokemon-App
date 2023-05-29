import React from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'

const MoveDetail = () => {
  const { id } = useParams()

  return (
    <motion.div
      className='mx-4'
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1, transitionDuration: '0.8s' }}
      exit={{ y: '100%', opacity: 0, transitionDuration: '0.75s' }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      The move id is { id }.
    </motion.div>
  )
}

export default MoveDetail