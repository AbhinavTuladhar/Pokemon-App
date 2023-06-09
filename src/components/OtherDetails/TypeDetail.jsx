import { React, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { AiFillCheckCircle, AiFillCloseCircle }  from 'react-icons/ai'
import { motion } from 'framer-motion'
import TypeCard from '../TypeCard'
import fetchData from '../../utils/fetchData'
import { extractTypeInformation } from '../../utils/extractInfo'
import PokemonCardList from '../MoveDetail/PokemonCardList'
import formatName from '../../utils/NameFormatting'

const TypeDetail = ( ) => {
  const { type } = useParams()
  const typeURL = `https://pokeapi.co/api/v2/type/${type}`

  const transformData = data => {
    const managedInformation = extractTypeInformation(data)
    return (managedInformation)
  }
  const { data: extractedInformation = []} = useQuery(
    ['typeDetail', type],
    () => fetchData(typeURL),
    { staleTime: Infinity, cacheTime: Infinity, select: transformData }
  )

  // Capitalise the first name for setting the document title.
  const formattedType = type.charAt(0).toUpperCase() + type.slice(1)

  useEffect(() => {
    document.title = `${formattedType} type Pokemon`
  }, [formattedType])

  // Now format the data for rendering purposes.
  // Prepare the type effectiveness list
  const doubleDamageFromList = extractedInformation?.doubleDamageFrom?.map(type => <TypeCard typeName={type} />)
  const doubleDamageToList = extractedInformation?.doubleDamageTo?.map(type => <TypeCard typeName={type} />)
  const halfDamageFromList = extractedInformation?.halfDamageFrom?.map(type => <TypeCard typeName={type} />)
  const halfDamageToList = extractedInformation?.halfDamageTo?.map(type => <TypeCard typeName={type} />)
  const noDamageFromList = extractedInformation?.noDamageFrom?.map(type => <TypeCard typeName={type} />)
  const noDamageToList = extractedInformation?.noDamageTo?.map(type => <TypeCard typeName={type} />)

  const titleDiv = (
    <h1 className='flex flex-row justify-center text-4xl font-semibold'> 
      { formattedType }&nbsp;
      <span className='brightness-75'> (type) </span>
    </h1>
  )

  const offensiveDiv = (
    <div className='gap-4'> 
      <div className='text-3xl font-bold'>
        Attack <span className='text-gray-300 italic'> pros & cons </span>
      </div>
      {
        doubleDamageToList?.length > 0 &&
        <>
          <div className='flex flex-row items-center gap-2 py-2 my-2'> 
            <AiFillCheckCircle className='text-green-400' /> { formattedType } moves are super-effective against 
          </div>
          <div className='flex flex-row flex-wrap gap-2 ml-4'>
            { doubleDamageToList }
          </div>
        </>
      }

      <div className='flex flex-row items-center gap-2 py-2 my-2'> 
          <AiFillCloseCircle className='text-red-400' /> {formattedType} moves are not very effective against
      </div>
        <div className='flex flex-row flex-wrap gap-2 ml-4'>
          { halfDamageToList }
        </div>

      { noDamageToList?.length > 0 &&
        <>
          <div className='flex flex-row items-center gap-2 py-2 my-2'> 
            <AiFillCloseCircle className='text-red-400' /> {formattedType} moves have no effect on 
          </div>
          <div className='flex flex-row flex-wrap gap-2 ml-4'>
            { noDamageToList }
          </div>
        </>
      }
    </div>
  )

  const defensiveDiv = (
    <div className='gap-4'> 
      <div className='text-3xl font-bold'>
        Defence <span className='text-gray-300 italic'> pros & cons </span>
      </div>
      {
        doubleDamageFromList?.length > 0 &&
        <>
          <div className='flex flex-row items-center gap-2 py-2 my-2'> 
            <AiFillCheckCircle className='text-green-400' /> These types are super-effective against {formattedType} Pokemon.
          </div>
          <div className='flex flex-row flex-wrap gap-2 ml-4'>
            { doubleDamageFromList }
          </div>
        </>
      }

      {
        halfDamageFromList?.length > 0 &&
        <>
          <div className='flex flex-row items-center gap-2 py-2 my-2'> 
            <AiFillCloseCircle className='text-red-400' /> These types are not very effective against {formattedType} Pokemon.
          </div>
          <div className='flex flex-row flex-wrap gap-2 ml-4'>
            { halfDamageFromList }
          </div>
        </>
      }

      { noDamageFromList?.length > 0 &&
        <>
          <div className='flex flex-row items-center gap-2 py-2 my-2'> 
            <AiFillCloseCircle className='text-red-400' />  These types have no effect on {formattedType} Pokemon.
          </div>
          <div className='flex flex-row flex-wrap gap-2 ml-4'>
            { noDamageFromList }
          </div>
        </>
      }
    </div>
  )

  return (
    <motion.div 
      className='md:mx-10 mx-4'
      initial={{ x: '-100%', opacity: 0 }}
      animate={{ x: 0, scale: 1, opacity: 1, transitionDuration: '0.25s' }}
      exit={{ x: '100%', opacity: 0, transitionDuration: '0.25s' }}
      transition={{ duration: 0.5, ease: 'easeIn' }}
    >
      { titleDiv }
      <div className='gap-y-4'>
        {offensiveDiv}
      </div>
      <div className='gap-y-4 my-4'>
        {defensiveDiv}
      </div>
      <div>
        { <PokemonCardList title={`${formatName(type)} Pokemon`} pokemonUrls={extractedInformation.pokemonList} />}
      </div>
    </motion.div>
  )
}

export default TypeDetail;