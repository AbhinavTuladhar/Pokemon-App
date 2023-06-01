import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const WelcomePage = () => {
  const location = useLocation()
  useEffect(() => {
    document.title = 'Pokedex'
  }, [location])
  
  return(
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{ y: '100%', opacity: 0, transitionDuration: '0.5s' }}
      transition={{ ease: 'easeIn'}}
      className='mx-2 pt-10 flex flex-col justify-center items-center gap-y-4'
    >
      <div className="flex text-5xl justify-center font-bold mx-auto">
        Welcome!
      </div>
      <div className='text-center'>
        This is a simple clone of the <a href='https://pokemondb.net/' className='text-blue-500'> Pokemon Database website. </a>
        This was made using ReactJS, React Router, Tailwind CSS and some other libraries. <br />
        See the package.json file in my GitHub repo linked below for details.
      </div>
      <div className='text-center'>
        You can view the (incredibly noob-ish) source code <a href='https://github.com/AbhinavTuladhar/Pokemon-App' className='text-blue-500'> here. </a>
      </div>
    </motion.div>
  )
}

export default WelcomePage