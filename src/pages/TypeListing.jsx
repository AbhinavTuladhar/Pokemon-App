import { React, useMemo } from 'react'
import { motion } from 'framer-motion'
import TypeCard from '../components/TypeCard'
import TypeChartFull from '../components/TypeChartFull'
import TypeMultiplierBox from '../components/TypeMultiplierBox'

const typeVariant = {
  initial: { y: '4rem', opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { staggerChildren: 0.05, ease: 'easeOut', duration: 0.5 },
  },
}

const fadeInVariant = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { ease: 'easeOut', duration: 0.6 },
  },
}

const TypeListing = () => {
  const typeList = useMemo(() => {
    return [
      'normal',
      'fire',
      'water',
      'electric',
      'grass',
      'ice',
      'fighting',
      'poison',
      'ground',
      'flying',
      'psychic',
      'bug',
      'rock',
      'ghost',
      'dragon',
      'dark',
      'steel',
      'fairy',
    ]
  }, [])

  const typeCardList = typeList.map((type, index) => (
    <motion.div variants={typeVariant} key={index}>
      <TypeCard typeName={type} />
    </motion.div>
  ))

  document.title = 'Pokémon types | Pokémon database'

  // For the chart key
  const chartKeyData = [
    { multiplier: 0, text: 'No effect (0%)' },
    { multiplier: 0.5, text: 'Not very effective (50%)' },
    { multiplier: 1, text: 'Normal (100%)' },
    { multiplier: 2, text: 'Super-effective (200%)' },
  ]

  const chartKeyInfo = chartKeyData.map((row, rowIndex) => {
    const { multiplier, text } = row
    return (
      <div className="flex flex-row items-center gap-x-4" key={rowIndex}>
        <TypeMultiplierBox multiplier={multiplier} />
        <p> {text} </p>
      </div>
    )
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transitionDuration: '0.5s' }}
      exit={{ opacity: 0, transitionDuration: '0.5s' }}
      transition={{ ease: 'easeIn' }}
    >
      <motion.section variants={typeVariant} initial="initial" animate="animate">
        <motion.h1 className="flex justify-center mb-8 text-5xl font-bold text-center" variants={typeVariant}>
          Pokémon types & type chart
        </motion.h1>
        <motion.h1 className="flex justify-center mb-10 text-4xl font-bold text-center" variants={typeVariant}>
          Type quick-list
        </motion.h1>
        <motion.div
          className="flex flex-row flex-wrap justify-center gap-4 mb-4"
          variants={typeVariant}
          initial="initial"
          animate="animate"
        >
          {typeCardList}
        </motion.div>

        <motion.h1 className="mb-4 text-3xl font-bold" variants={fadeInVariant}>
          Type Chart
        </motion.h1>

        <motion.section className="flex flex-row flex-wrap justify-between" variants={fadeInVariant}>
          <div className="w-full mdlg:w-1/3">
            <p>
              The full type chart here displays the strengths and weaknesses of each type. Look down the left hand side
              for the attacking type, then move across to see how effective it is against each Pokémon type.
            </p>
            <div>
              <h1 className="my-4 text-2xl font-bold">Chart Key</h1>
              {chartKeyInfo}
            </div>
          </div>
          <div className="flex justify-center w-full mt-4 mdlg:w-2/3 mdlg:justify-end mdlg:mt-0">
            <TypeChartFull />
          </div>
        </motion.section>
      </motion.section>
    </motion.div>
  )
}

export default TypeListing
