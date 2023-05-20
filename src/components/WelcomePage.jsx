import React from 'react'
import { motion } from 'framer-motion'

const WelcomePage = () => {
  return(
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
    >
      <h1>
        Welcome page
      </h1>
    </motion.div>
  )
}

export default WelcomePage