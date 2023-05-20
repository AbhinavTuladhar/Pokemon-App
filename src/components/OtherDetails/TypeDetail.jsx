import { React, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { AiFillCheckCircle, AiFillCloseCircle }  from 'react-icons/ai'
import { motion } from 'framer-motion'
import TypeCard from '../TypeCard'
import useFetch from '../../utils/useFetch'

const TypeDetail = ( ) => {
  const { type } = useParams()
  const typeURL = `https://pokeapi.co/api/v2/type/${type}`
  const [typeData, setTypeData] = useState({})
  const [extractedInformation, setExtractedInformation] = useState({})

  const { data: fetchedData, loading: dataLoading } = useFetch(typeURL)

  // Capitalise the first name
  const formattedType = type.charAt(0).toUpperCase() + type.slice(1)

  useEffect(() => {
    document.title = `${formattedType} type Pokemon`
  }, [formattedType])
  
  useEffect(() => {
    if (fetchedData) {
      setTypeData(fetchedData);
    }
  }, [fetchedData])

  useEffect(() => {
    const extractInformation = data => {
      const {
        damage_relations: damageRelations,
        moves: moveList,
        pokemon: pokemonList,
      } = data
      const {
        double_damage_from: doubleDamageFrom,
        double_damage_to: doubleDamageTo,
        half_damage_from: halfDamageFrom,
        half_damage_to: halfDamageTo,
        no_damage_from: noDamageFrom,
        no_damage_to: noDamageTo
      } = damageRelations

      const extractName = arr => arr.map(type => type.name)

      return {
        doubleDamageFrom: extractName(doubleDamageFrom),
        doubleDamageTo: extractName(doubleDamageTo),
        halfDamageFrom: extractName(halfDamageFrom),
        halfDamageTo: extractName(halfDamageTo),
        noDamageFrom: extractName(noDamageFrom),
        noDamageTo: extractName(noDamageTo),
        moveList: moveList,
        pokemonList: pokemonList,
      }
    }
    if (Object.keys(typeData).length !== 0) {
      const managedInformation = extractInformation(typeData)
      setExtractedInformation(managedInformation)
    }
  }, [typeData])

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
            <AiFillCheckCircle className='text-green-400' />  <span className='italic'> { formattedType } </span> moves are super-effective against 
          </div>
          <div className='flex flex-row flex-wrap gap-2 ml-4'>
            { doubleDamageToList }
          </div>
        </>
      }

      <div className='flex flex-row items-center gap-2 py-2 my-2'> 
          <AiFillCloseCircle className='text-red-400' />  <span className='italic'> {formattedType} </span> moves are not very effective against
      </div>
        <div className='flex flex-row flex-wrap gap-2 ml-4'>
          { halfDamageToList }
        </div>

      { noDamageToList?.length > 0 &&
        <>
          <div className='flex flex-row items-center gap-2 py-2 my-2'> 
            <AiFillCloseCircle className='text-red-400' />  <span className='italic'> {formattedType} </span> moves have no effect on 
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
            <AiFillCheckCircle className='text-green-400' /> These types are super-effective against <span className='italic'> {formattedType} </span> Pokemon.
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
            <AiFillCloseCircle className='text-red-400' /> These types are not very effective against <span className='italic'> {formattedType} </span> Pokemon.
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

  if (dataLoading || Object.keys(typeData).length === 0) {
    return <div className='flex justify-center items-center text-4xl h-screen'>  </div>
  }

  return (
    <motion.div 
      className='mx-2'
      // initial={{ opacity: 0, scale: 0.95 }}
      // animate={{ opacity: 1, scale: 1 }}
      // exit={{ opacity: 0, scale: 0.95 }}
      initial={{ x: '-100%', scale: 0.25, opacity: 0 }}
      animate={{ x: 0, scale: 1, opacity: 1 }}
      exit={{ x: '100%', scale: 0.25, opacity: 0 }}
      // initial={{ x: '-100%', opacity: 0 }}
      // animate={{ x: 0, opacity: 1 }}
      // exit={{ x: '100%', opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeIn' }}
    >
      { titleDiv }
      <div className='gap-y-4'>
        {offensiveDiv}
      </div>
      <div className='gap-y-4 my-4'>
        {defensiveDiv}
      </div>
    </motion.div>
  )
}

export default TypeDetail;