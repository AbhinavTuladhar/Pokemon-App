import React from 'react'
import { useQuery } from 'react-query'
import SectionTitle from '../../components/SectionTitle'
import fetchData from '../../utils/fetchData'
import { extractTypeInformation } from '../../utils/extractInfo'
import calculateTypeEffectiveness from '../../utils/typeEffectiveness'
import formatName from '../../utils/NameFormatting'
import OneLineSkeleton from '../../components/OneLineSkeleton'
import MiniTypeCard from '../../components/MiniTypeCard'
import TypeMultiplierBox from '../../components/TypeMultiplierBox'

const TypeChart = ({ data }) => {
  const { types, name } = data
  const typeUrls = types.map(type => type.type.url)

  const transformData = data => {
    return data.map(type => {
      const { doubleDamageFrom, halfDamageFrom, noDamageFrom } = extractTypeInformation(type)
      return { doubleDamageFrom, halfDamageFrom, noDamageFrom }
    })
  }

  const { data: typeData, isLoading } = useQuery(
    ['typeData', types],
    () => Promise.all(typeUrls.map(fetchData)),
    { staleTime: Infinity, cacheTime: Infinity, select: transformData }
  )

  if (isLoading) return <OneLineSkeleton />

  // Now calculate a type-effectiveness object
  const obj = calculateTypeEffectiveness(typeData)
  const typeDefenseInfo = Object.entries(obj).map(([type, multiplier]) => {
    return { type, multiplier }
  })

  // Break down the 18 types into two rows, with nine types each.
  return (
    <section>
      <SectionTitle text='Type Defenses' />
      <span> {`The effectiveness of each type on ${formatName(name)}: `} </span>

      <div className='flex flex-col md:flex-row mdlg:flex-col sm:flex-row justify-center'>
        <div className='flex flex-row flex-wrap mt-6 gap-x-[1px] justify-center'>
          {typeDefenseInfo.slice(0, 9).map(row => (
            <div className='flex flex-col w-9 text-center'>
              <MiniTypeCard typeName={row.type} />
              <TypeMultiplierBox multiplier={row.multiplier} />
            </div>
          ))}
        </div>

        <div className='flex flex-row flex-wrap mt-2 md:mt-6 sm:mt-6 gap-x-[1px] justify-center'>
          {typeDefenseInfo.slice(9).map(row => (
            <div className='flex flex-col w-9 text-center'>
              <MiniTypeCard typeName={row.type} />
              <TypeMultiplierBox multiplier={row.multiplier} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TypeChart