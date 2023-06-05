import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useFetch from '../utils/useFetch'
import { extrctAbilityInformation } from '../utils/extractInfo'
import formatName from '../utils/NameFormatting'
import { motion } from 'framer-motion'
import AbilityEffect from '../components/AbilityDetail/AbilityEffect'

const AbilityDetail = () => {
  const { id } = useParams()
  const [abilityInfo, setAbilityInfo] = useState({})

  const { data: abilityData } = useFetch(`https://pokeapi.co/api/v2/ability/${id}/`)

  useEffect(() => {
    if (abilityData.length === 0)
      return
    const extracted = extrctAbilityInformation(abilityData)
    console.log(extracted.longEntry)  
    setAbilityInfo(extracted)
  }, [abilityData])

  return (
    <motion.div
      className='mx-10'
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1, transitionDuration: '0.8s' }}
      exit={{ y: '100%', opacity: 0, transitionDuration: '0.75s' }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <div className='flex justify-center text-center text-4xl font-bold'>
        { formatName(abilityInfo.name) } (ability)
      </div>
      <div className='flex flex-row flex-wrap gap-x-10 mt-4'>
        <div className='flex flex-col lg:w-475/1000 w-full'> 
          <AbilityEffect entry={abilityInfo.longEntry} />
        </div>
        <div className='flex flex-col lg:w-475/1000 w-full'> 
          Test2
        </div>
      </div>
    </motion.div>
  )
}

export default AbilityDetail