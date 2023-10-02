import React from 'react'
import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'

const welcomeVariant = {
  initial: { y: "10rem", opacity: 0 },
  animate: {
    y: 0, opacity: 1,
    transition: { staggerChildren: 0.15, ease: "easeOut", duration: 0.8 },
  },
}

const entryVariantLeft = {
  initial: { x: "-10rem", opacity: 0 },
  animate: {
    x: 0, opacity: 1,
    transition: { staggerChildren: 0.25, ease: "easeOut", duration: 1 },
  },
}

const entryVariantRight = {
  initial: { x: "10rem", opacity: 0 },
  animate: {
    x: 0, opacity: 1,
    transition: { staggerChildren: 0.3, ease: "easeInOut", duration: 0.8, delay: 0.4 },
  },
}

const ImageColumn = () => {
  return (
    <motion.div
      className='flex flex-col items-center justify-center w-full h-full md:w-4/12 gap-y-10'
      variants={entryVariantRight}
    >
      <img
        src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif'
        className='flex-grow h-40'
        alt='Pikachu gif'
      />
      <img
        src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/6.gif'
        className='flex-grow h-40'
        alt='Charizard gif'
      />
    </motion.div>
  )
}

const TitleText = () => {
  return (
    <>
      <motion.div variants={entryVariantLeft} initial='initial' animate='animate'>
        <motion.span className='text-center' variants={entryVariantLeft}>
          <span className='text-5xl font-bold'>Welcome to</span>
          <br />
          <span className='text-5xl font-bold text-transparent bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text'>Pokémon Database</span>
        </motion.span>
        <small className='text-xs'>'s clone!</small>
      </motion.div>
    </>
  );
}

const InformativeText = () => {
  return (
    <>
      <motion.span variants={entryVariantLeft}>
        This is a simple clone of the <a href='https://pokemondb.net/' className='text-blue-500'> Pokemon Database website. </a>
      </motion.span>
      <motion.span variants={entryVariantLeft}>
        This was made using ReactJS, React Router, Tailwind CSS and some other libraries.
      </motion.span>
      <motion.span variants={entryVariantLeft}>
        You can view the source code <a href='https://github.com/AbhinavTuladhar/Pokemon-App' className='text-blue-500'> here. </a>
      </motion.span>
    </>
  )
}

const IssuesText = () => {
  const listItems = [
    {
      text: (<>
        <NavLink to='/pokemon/wurmple' className='hoverable-link'> Wurmple </NavLink>
        's evolution chain doesn't work.
      </>),
      style: 'pt-4'
    },
    { text: 'Egg groups' },
    { text: 'Location-wise encounters for each game', style: 'line-through' },
    { text: "No sprite collection for each Pokémon.", style: 'line-through' },
    { text: "Dual-type chart (not sure if it's even possible)", style: 'line-through' },
  ]
  return (
    <motion.div className='gap-y-5' variants={entryVariantLeft}>
      <motion.span className='text-2xl font-bold' variants={entryVariantLeft}>
        Known issues / Todos
      </motion.span>
      <motion.ul className='space-y-3 list-disc list-inside strik' variants={entryVariantLeft}>
        {listItems.map((item, index) => (
          <motion.li variants={entryVariantLeft} className={item?.style} key={index}> {item.text} </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  )
}

const WelcomePage = () => {
  document.title = 'Pokémon Database clone'

  return (
    <motion.div
      exit={{ y: '100%', opacity: 0, transitionDuration: '0.5s' }}
      transition={{ ease: 'easeIn' }}
      className='mx-2'
    >
      <motion.div
        className='flex flex-col items-center justify-center py-4 mx-2 md:flex-row gap-y-4 md:mx-10'
        variants={welcomeVariant} initial="initial" animate="animate"
      >
        <motion.div className='w-5/6 md:w-475/1000' variants={entryVariantLeft}>
          <motion.div
            variants={entryVariantLeft}
          >
            <TitleText />
          </motion.div>
          <motion.div className='flex flex-col py-4 space-y-4' variants={entryVariantLeft}>
            <InformativeText />
            <IssuesText />
          </motion.div>
        </motion.div>

        <ImageColumn />

      </motion.div>
    </motion.div>
  )
}

export default WelcomePage