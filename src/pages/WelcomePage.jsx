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
      className='md:w-4/12 w-full h-full flex flex-col justify-center items-center gap-y-10'
      variants={entryVariantRight}
    >
      <img
        src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif'
        className='h-40 flex-grow'
        alt='Pikachu gif'
      />
      <img
        src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/6.gif'
        className='h-40 flex-grow'
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
          <span className='text-5xl font-bold bg-gradient-to-r from-green-500  to-blue-500 text-transparent bg-clip-text'>Pokémon Database</span>
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
        See the package.json file in my GitHub repo linked below for details. 
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
        <NavLink to='/pokemon/wurmple' className='hoverable-link'> Wurmple</NavLink> 
        's evolution chain doesn't work. 
      </>),
      style: 'pt-4' 
    },
    { text: 'Location-wise encounters for each game' },
    { text: "No sprite collection for each Pokémon.", style: 'line-through' },
    { text: "Dual-type chart (not sure if it's even possible)", style: 'line-through' },
  ]
  return (
    <motion.div className='gap-y-5' variants={entryVariantLeft}>
      <motion.span className='text-2xl font-bold' variants={entryVariantLeft}>
        Known issues / Todos
      </motion.span>
      <motion.ul className='list-inside list-disc space-y-3 strik' variants={entryVariantLeft}>
        {listItems.map((item, index) => (
          <motion.li variants={entryVariantLeft} className={item?.style} key={index}> { item.text } </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  )
}

const WelcomePage = () => {
  document.title = 'Pokémon Database clone'

  return(
    <motion.div
      exit={{ y: '100%', opacity: 0, transitionDuration: '0.5s' }}
      transition={{ ease: 'easeIn' }}
      className='mx-2'
    >
      <motion.div 
        className='py-4 flex md:flex-row flex-col justify-center items-center gap-y-4 md:mx-10 mx-2'
        variants={welcomeVariant} initial="initial" animate="animate"
      >
        <motion.div className='md:w-475/1000 w-5/6' variants={entryVariantLeft}>
          <motion.div
            variants={entryVariantLeft}
          >
            <TitleText />
          </motion.div>
          <motion.div className='space-y-4 py-4 flex flex-col' variants={entryVariantLeft}>
            <InformativeText />
            <IssuesText />
          </motion.div>
        </motion.div>

        <ImageColumn />

      </motion.div>
<ul
  class="mb-5 flex list-none flex-row flex-wrap border-b-0 pl-0"
  role="tablist"
  data-te-nav-ref>
  <li role="presentation">
    <a
      href="#tabs-home"
      class="my-2 block border-x-0 border-b-2 border-t-0 border-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-500 hover:isolate hover:border-transparent hover:bg-neutral-100 focus:isolate focus:border-transparent data-[te-nav-active]:border-primary data-[te-nav-active]:text-primary dark:text-neutral-400 dark:hover:bg-transparent dark:data-[te-nav-active]:border-primary-400 dark:data-[te-nav-active]:text-primary-400"
      data-te-toggle="pill"
      data-te-target="#tabs-home"
      data-te-nav-active
      role="tab"
      aria-controls="tabs-home"
      aria-selected="true"
      >Home</a
    >
  </li>
  <li role="presentation">
    <a
      href="#tabs-profile"
      class="focus:border-transparen my-2 block border-x-0 border-b-2 border-t-0 border-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-500 hover:isolate hover:border-transparent hover:bg-neutral-100 focus:isolate data-[te-nav-active]:border-primary data-[te-nav-active]:text-primary dark:text-neutral-400 dark:hover:bg-transparent dark:data-[te-nav-active]:border-primary-400 dark:data-[te-nav-active]:text-primary-400"
      data-te-toggle="pill"
      data-te-target="#tabs-profile"
      role="tab"
      aria-controls="tabs-profile"
      aria-selected="false"
      >Profile</a
    >
  </li>
  <li role="presentation">
    <a
      href="#tabs-messages"
      class="my-2 block border-x-0 border-b-2 border-t-0 border-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-500 hover:isolate hover:border-transparent hover:bg-neutral-100 focus:isolate focus:border-transparent data-[te-nav-active]:border-primary data-[te-nav-active]:text-primary dark:text-neutral-400 dark:hover:bg-transparent dark:data-[te-nav-active]:border-primary-400 dark:data-[te-nav-active]:text-primary-400"
      data-te-toggle="pill"
      data-te-target="#tabs-messages"
      role="tab"
      aria-controls="tabs-messages"
      aria-selected="false"
      >Messages</a
    >
  </li>
  <li role="presentation">
    <a
      href="#tabs-contact"
      class="disabled pointer-events-none my-2 block border-x-0 border-b-2 border-t-0 border-transparent bg-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-400 hover:isolate hover:border-transparent hover:bg-neutral-100 focus:isolate focus:border-transparent dark:text-neutral-600"
      data-te-toggle="pill"
      data-te-target="#tabs-contact"
      role="tab"
      aria-controls="tabs-contact"
      aria-selected="false"
      >Contact</a
    >
  </li>
</ul>

<div class="mb-6">
  <div
    class="hidden opacity-100 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
    id="tabs-home"
    role="tabpanel"
    aria-labelledby="tabs-home-tab"
    data-te-tab-active>
    Tab 1 content
  </div>
  <div
    class="hidden opacity-0 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
    id="tabs-profile"
    role="tabpanel"
    aria-labelledby="tabs-profile-tab">
    Tab 2 content
  </div>
  <div
    class="hidden opacity-0 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
    id="tabs-messages"
    role="tabpanel"
    aria-labelledby="tabs-profile-tab">
    Tab 3 content
  </div>
  <div
    class="hidden opacity-0 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
    id="tabs-contact"
    role="tabpanel"
    aria-labelledby="tabs-contact-tab">
    Tab 4 content
  </div>
</div>
    </motion.div>
  )
}

export default WelcomePage