import React from 'react'
import { motion } from 'framer-motion'

const WelcomePage = () => {
  document.title = 'Pokémon Database clone'

  return(
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{ y: '100%', opacity: 0, transitionDuration: '0.5s' }}
      transition={{ ease: 'easeIn'}}
      className='mx-2'
    >
      <section className='py-4 flex md:flex-row flex-col justify-center items-center gap-y-4 md:mx-10 mx-2'>
        <div className='md:w-4/12 w-full h-full flex flex-col justify-center items-center gap-y-10'>
          <img
            src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif'
            className='h-40 flex-grow'
          />
          <img
            src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/6.gif'
            className='h-40 flex-grow'
          />
        </div>
        <div className='md:w-475/1000 w-5/6'>
          <span className='text-center'>
            <span className='text-5xl font-bold'> Welcome to <br /> Pokémon Database </span>
            <small className='text-xs'>'s clone </small>!
          </span>
          <div className='space-y-4 py-4 flex flex-col'>
            <span> 
              This is a simple clone of the <a href='https://pokemondb.net/' className='text-blue-500'> Pokemon Database website. </a> 
            </span>
            <span> 
              This was made using ReactJS, React Router, Tailwind CSS and some other libraries. 
            </span>
            <span> 
              See the package.json file in my GitHub repo linked below for details. 
            </span>
            <span> 
                You can view the source code <a href='https://github.com/AbhinavTuladhar/Pokemon-App' className='text-blue-500'> here. </a>
            </span>
            <div className='gap-y-5'>
              <span className='text-2xl font-bold'>
                Known issues / Todos
              </span>
              <ul className='list-inside list-disc space-y-3'>
                <li className='pt-4'> Wurmple's evolution chain doesn't work. </li>
                <li> No sprite collection for each Pokémon.  </li>
                <li> Dual-type chart (not sure if it's even possible) </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  )
}

export default WelcomePage