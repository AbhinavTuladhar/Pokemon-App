import React from 'react'
import { useQueries } from '@tanstack/react-query'
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

const TypeDefenceRow = ({ typeDefenceInfo, extraClassName }) => (
  <div className={`flex flex-row justify-center overflow-x-auto overflow-y-hidden mx-auto sm:mx-0 ${extraClassName}`}>
    {typeDefenceInfo.map((row, rowIndex) => (
      <div className='flex flex-col text-center w-9' key={rowIndex}>
        <MiniTypeCard typeName={row.type} />
        <div id={row.type}>
          <TypeMultiplierBox multiplier={row.multiplier} />
        </div>
      </div>
    ))}
  </div>
)

const TypeChart = ({ data }) => {
  const { types, name } = data
  const typeUrls = types.map(type => type.type.url)
  const typeNames = types.map(type => formatName(type.type.name))
  const typeNamesString = typeNames.join('/')

  const transformData = data => {
    const { doubleDamageFrom, halfDamageFrom, noDamageFrom } = extractTypeInformation(data)
    return { doubleDamageFrom, halfDamageFrom, noDamageFrom }
  }

  const { data: typeData, isLoading } = useQueries({
    queries: typeUrls.map(url => {
      return {
        queryKey: ['type', url],
        queryFn: () => fetchData(url),
        staleTime: Infinity,
        cacheTime: Infinity,
        select: (data) => transformData(data)
      }
    }),
    combine: results => {
      return {
        data: results.map(result => result.data),
        isLoading: results.some(result => result.isLoading)
      }
    }
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

  const firstClassName = 'mt-6'
  const secondClassName = 'mt-2 md:mt-6 sm:mt-6'

  // Break down the 18 types into two rows, with nine types each.
  return (
    <section>
      <SectionTitle text='Type Defenses' />
      <span> {`The effectiveness of each type on ${formatName(name)}: `} </span>

      <div className='flex flex-col justify-center md:flex-row mdlg:flex-col sm:flex-row overflow-x-scroll'>
        <TypeDefenceRow typeDefenceInfo={typeDefenseInfo.slice(0, 9)} extraClassName={firstClassName} />
        <TypeDefenceRow typeDefenceInfo={typeDefenseInfo.slice(9)} extraClassName={secondClassName} />
      </div>

      <>
        {toolTipData}
      </>

    </section>
  )
}

export default TypeChart