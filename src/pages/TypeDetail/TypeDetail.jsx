import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { AiFillCheckCircle, AiFillCloseCircle }  from 'react-icons/ai'
import { motion } from 'framer-motion'
import TypeCard from '../../components/TypeCard'
import PokemonCardList from '../../components/PokemonCardList'
import TypeDetailCard from './TypeDetailCard'
import DualTypeChart from './DualTypeChart'
import fetchData from '../../utils/fetchData'
import { extractTypeInformation } from '../../utils/extractInfo'
import formatName from '../../utils/NameFormatting'

const simpleFadeInVariant = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { staggerChildren: 0.2, ease: "easeOut", duration: 0.5 },
  },
}

const simpleFadeInNoDelayVariant = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { ease: "easeOut", duration: 0.8 },
  },
}

const TypeDetail = ( ) => {
  const { type } = useParams()
  const typeURL = `https://pokeapi.co/api/v2/type/${type}`

  const transformData = data => {
    const managedInformation = extractTypeInformation(data)
    return (managedInformation)
  }
  const { data: extractedInformation = [], isLoading } = useQuery(
    ['typeDetail', type],
    () => fetchData(typeURL),
    { staleTime: Infinity, cacheTime: Infinity, select: transformData }
  )

  const { pokemonList, moveList } = extractedInformation ?? {}

  const formattedType = type.charAt(0).toUpperCase() + type.slice(1)

  // Now format the data for rendering purposes.
  // Prepare the type effectiveness list
  const doubleDamageFromList = extractedInformation?.doubleDamageFrom?.map(type => <TypeCard typeName={type} />)
  const doubleDamageToList = extractedInformation?.doubleDamageTo?.map(type => <TypeCard typeName={type} />)
  const halfDamageFromList = extractedInformation?.halfDamageFrom?.map(type => <TypeCard typeName={type} />)
  const halfDamageToList = extractedInformation?.halfDamageTo?.map(type => <TypeCard typeName={type} />)
  const noDamageFromList = extractedInformation?.noDamageFrom?.map(type => <TypeCard typeName={type} />)
  const noDamageToList = extractedInformation?.noDamageTo?.map(type => <TypeCard typeName={type} />)

  const titleDiv = (
    <motion.h1 className='flex flex-row justify-center text-4xl font-semibold' variants={simpleFadeInVariant}> 
      { formattedType }&nbsp;
      <span className='brightness-75'> (type) </span>
    </motion.h1>
  )

  const offensiveDiv = (
    <motion.div className='flex flex-wrap flex-col' variants={simpleFadeInVariant}> 
      <motion.div className='text-3xl font-bold'>
        Attack <span className='text-gray-300 italic'> pros & cons </span>
      </motion.div>
      {
        doubleDamageToList?.length > 0 &&
        <>
          <motion.div className='flex flex-row items-center gap-2 py-2 my-2' variants={simpleFadeInVariant}> 
            <AiFillCheckCircle className='text-green-400' /> { formattedType } moves are super-effective against 
          </motion.div>
          <motion.div className='flex flex-row flex-wrap gap-2 ml-4'>
            { doubleDamageToList }
          </motion.div>
        </>
      }

      <motion.div className='flex flex-row items-center gap-2 py-2 my-2' variants={simpleFadeInVariant}> 
          <AiFillCloseCircle className='text-red-400' /> {formattedType} moves are not very effective against
      </motion.div>
        <motion.div className='flex flex-row flex-wrap gap-2 ml-4' variants={simpleFadeInVariant}>
          { halfDamageToList }
        </motion.div>

      { noDamageToList?.length > 0 &&
        <>
          <motion.div className='flex flex-row items-center gap-2 py-2 my-2' variants={simpleFadeInVariant}> 
            <AiFillCloseCircle className='text-red-400' /> {formattedType} moves have no effect on 
          </motion.div>
          <motion.div className='flex flex-row flex-wrap gap-2 ml-4' variants={simpleFadeInVariant}>
            { noDamageToList }
          </motion.div>
        </>
      }
    </motion.div>
  )

  const defensiveDiv = (
    <motion.div className='flex flex-wrap flex-col' variants={simpleFadeInVariant}> 
      <motion.div className='text-3xl font-bold' variants={simpleFadeInVariant}>
        Defence <span className='text-gray-300 italic'> pros & cons </span>
      </motion.div>
      {
        doubleDamageFromList?.length > 0 &&
        <>
          <motion.div className='flex flex-row items-center gap-2 py-2 my-2' variants={simpleFadeInVariant}> 
            <AiFillCheckCircle className='text-green-400' /> These types are super-effective against {formattedType} Pokemon.
          </motion.div>
          <motion.div className='flex flex-row flex-wrap gap-2 ml-4' variants={simpleFadeInVariant}>
            { doubleDamageFromList }
          </motion.div>
        </>
      }

      {
        halfDamageFromList?.length > 0 &&
        <>
          <motion.div className='flex flex-row items-center gap-2 py-2 my-2' variants={simpleFadeInVariant}> 
            <AiFillCloseCircle className='text-red-400' /> These types are not very effective against {formattedType} Pokemon.
          </motion.div>
          <motion.div className='flex flex-row flex-wrap gap-2 ml-4' variants={simpleFadeInVariant}>
            { halfDamageFromList }
          </motion.div>
        </>
      }

      { noDamageFromList?.length > 0 &&
        <>
          <motion.div className='flex flex-row items-center gap-2 py-2 my-2' variants={simpleFadeInVariant}> 
            <AiFillCloseCircle className='text-red-400' />  These types have no effect on {formattedType} Pokemon.
          </motion.div>
          <motion.div className='flex flex-row flex-wrap gap-2 ml-4' variants={simpleFadeInVariant}>
            { noDamageFromList }
          </motion.div>
        </>
      }
    </motion.div>
  )

  document.title = `${formattedType} type Pokémon | Pokémon database`

  if (isLoading) return

  const { doubleDamageTo, halfDamageTo, noDamageTo } = extractedInformation

  const DualTypeChartProps = {
    typeName: type,
    doubleDamageTo,
    halfDamageTo,
    noDamageTo,
  }

  return (
    <motion.div 
      className='md:mx-10 mx-4'
      exit={{ x: '100%', opacity: 0, transitionDuration: '0.5s' }}
    >
      <motion.div vairants={simpleFadeInVariant} initial='initial' animate='animate'>
        
        <motion.div variants={simpleFadeInVariant}>
          <motion.div variants={simpleFadeInVariant}>
            { titleDiv }
          </motion.div>
          <motion.div variants={simpleFadeInVariant}>
            <TypeDetailCard moveList={moveList} pokemonList={pokemonList} typeName={type} />
          </motion.div>
        </motion.div>

        <motion.div className='flex flex-row flex-wrap justify-between mt-4' variants={simpleFadeInNoDelayVariant}>

          <motion.div variants={simpleFadeInNoDelayVariant} className='w-full mdlg:w-1/3'>

            <motion.div variants={simpleFadeInNoDelayVariant} className='mb-10'>
              { offensiveDiv }
            </motion.div>
            <motion.div variants={simpleFadeInNoDelayVariant}>
              { defensiveDiv }
            </motion.div>

          </motion.div>

          <motion.div variants={simpleFadeInNoDelayVariant} className='flex flex-col w-full mdlg:w-2/3 mt-4 mdlg:mt-0 pl-0 mdlg:pl-16'>
            <h1 className='text-3xl font-bold'>
              Dual type attack pros & cons
            </h1>
            <p className='my-4'>
              {`This chart shows the strength of the ${type} type against every type combination. The fraction of damage a ${type} type move will deal is shown - ½ means 50% damage (not very effective), 2 means 200% (super-effective) and so on.`}
            </p>
            <DualTypeChart data={DualTypeChartProps} />
          </motion.div>

        </motion.div>

        <motion.div variants={simpleFadeInVariant}>
          { <PokemonCardList title={`${formatName(type)} Pokemon`} pokemonUrls={extractedInformation.pokemonList} />}
        </motion.div>

      </motion.div>
    </motion.div>
  )
}

export default TypeDetail;