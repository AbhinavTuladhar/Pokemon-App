import React from 'react'
import { useQuery } from '@tanstack/react-query'
import SectionTitle from '../../components/SectionTitle'
import fetchData from '../../utils/fetchData'
import { extractTypeInformation } from '../../utils/extractInfo'
import calculateTypeEffectiveness from '../../utils/typeEffectiveness'
import formatName from '../../utils/NameFormatting'
import OneLineSkeleton from '../../components/OneLineSkeleton'
import MiniTypeCard from '../../components/MiniTypeCard'
import TypeMultiplierBox from '../../components/TypeMultiplierBox'
import { Tooltip } from 'react-tooltip'
import multiplierToString from '../../utils/multiplierToString'

const TypeChart = ({ data }) => {
  const { types, name } = data
  const typeUrls = types.map(type => type.type.url)
  const typeNames = types.map(type => formatName(type.type.name))
  const typeNamesString = typeNames.join('/')

  const transformData = data => {
    return data.map(type => {
      const { doubleDamageFrom, halfDamageFrom, noDamageFrom } = extractTypeInformation(type)
      return { doubleDamageFrom, halfDamageFrom, noDamageFrom }
    })
  }

  const { data: typeData, isLoading } = useQuery({
    queryKey: ['typeData', types],
    queryFn: () => Promise.all(typeUrls.map(fetchData)),
    staleTime: Infinity,
    cacheTime: Infinity,
    select: transformData
  })

  if (isLoading) return <OneLineSkeleton />

  // Now calculate a type-effectiveness object
  const obj = calculateTypeEffectiveness(typeData)
  const typeDefenseInfo = Object.entries(obj).map(([type, multiplier]) => {
    return { type, multiplier }
  })

  const toolTipData = typeDefenseInfo.map((obj, index) => {
    const { type, multiplier } = obj
    const effectivenessString = multiplierToString(multiplier)
    return (
      <Tooltip anchorSelect={`#${type}`} place='bottom' key={index}>
        <span className='text-xs'>
          {`${formatName(type)} → ${typeNamesString} = ${effectivenessString}`}
        </span>
      </Tooltip>
    )
  })

  // Break down the 18 types into two rows, with nine types each.
  return (
    <section>
      <SectionTitle text='Type Defenses' />
      <span> {`The effectiveness of each type on ${formatName(name)}: `} </span>

      <div className='flex flex-col justify-center md:flex-row mdlg:flex-col sm:flex-row'>
        <div className='flex flex-row flex-wrap mt-6 gap-x justify-center'>
          {typeDefenseInfo.slice(0, 9).map((row, rowIndex) => (
            <div className='flex flex-col text-center w-9' key={rowIndex}>
              <MiniTypeCard typeName={row.type} />
              <div id={row.type}>
                <TypeMultiplierBox multiplier={row.multiplier} />
              </div>
            </div>
          ))}
        </div>

        <div className='flex flex-row flex-wrap mt-2 md:mt-6 sm:mt-6 gap-x justify-center'>
          {typeDefenseInfo.slice(9).map((row, rowIndex) => (
            <div className='flex flex-col text-center w-9' key={rowIndex}>
              <MiniTypeCard typeName={row.type} />
              <div id={row.type}>
                <TypeMultiplierBox multiplier={row.multiplier} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <>
        {toolTipData}
      </>

    </section>
  )
}

export default TypeChart