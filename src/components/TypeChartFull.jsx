import React from 'react'
import { useQueries } from '@tanstack/react-query'
import Skeleton from 'react-loading-skeleton'
import TypeCard from './TypeCard'
import MiniTypeCard from './MiniTypeCard'
import TypeMultiplierBox from './TypeMultiplierBox'
import { extractTypeInformation } from '../utils/extractInfo'
import fetchData from '../utils/fetchData'
import calculateTypeEffectiveness from '../utils/typeEffectiveness'
import { Tooltip } from 'react-tooltip'
import multiplierToString from '../utils/multiplierToString'
import formatName from '../utils/NameFormatting'

const TypeChartFull = () => {
  const typeListing = [
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
  const typeData = typeListing.map((type) => ({
    name: type,
    url: `https://pokeapi.co/api/v2/type/${type}`,
  }))

  /*
  Step 1: Extract type information
  Step 2: Calculate the type chart, and return an object containing the type chart with the defending
  type name
  Step 3: Properly format the type chart object.
  */
  const transformData = (type) => {
    const extractedInfo = extractTypeInformation(type)
    const { name: typeName } = extractedInfo
    const typeChart = calculateTypeEffectiveness([extractedInfo])
    const typeDefenceInfo = Object.entries(typeChart).map(([typeName, multiplier]) => ({
      typeName,
      multiplier,
    }))
    return { typeName, typeDefenceInfo }
  }

  const { data: extractedInformation, isLoading } = useQueries({
    queries: typeData.map((type) => {
      return {
        queryKey: ['type', type.url],
        queryFn: () => fetchData(type.url),
        staleTime: Infinity,
        cacheTime: Infinity,
        select: (data) => transformData(data),
      }
    }),
    combine: (results) => {
      return {
        data: results.map((result) => result.data),
        isLoading: results.some((result) => result.isLoading),
      }
    },
  })

  if (isLoading) {
    return <Skeleton width="90%" height="20rem" containerClassName="flex-1 w-full flex justify-end" />
  }

  // To show the defending and attacking types.
  const cornerDiv = (
    <div className="flex flex-col items-center justify-center w-20 text-xs border rounded-md h-9 border-slate-700">
      <span> DEFENCE → </span>
      <span> ATTACK ↴ </span>
    </div>
  )

  // An empty array at the beginning for a div containing info about the axes.
  const fullTypeCards = [[], ...typeListing].map((type, index) => {
    if (index === 0) {
      return cornerDiv
    } else {
      return <TypeCard typeName={type} className="h-9" />
    }
  })

  const finalTypeCards = fullTypeCards.map((typeCard, index) => (
    <div className="flex justify-center items-center my-[2px]" key={`card-${index}`}>
      {typeCard}
    </div>
  ))

  // Make a dummy object in order to account for the first row.
  const dummy = [{ typeName: '', typeDefenceInfo: [{ typeName: '', multiplier: 1 }] }]

  const tableColumns = [dummy, ...extractedInformation]?.map((type, index) => {
    const { typeName: defendingTypeName, typeDefenceInfo: defenceInfo } = type

    const tableCells = defenceInfo?.map((defendingType, cellIndex) => {
      const { typeName: attackingTypeName, multiplier } = defendingType
      if (cellIndex === 0) {
        return (
          <div key={`cell-${cellIndex}`}>
            <MiniTypeCard typeName={defendingTypeName} />
            <div id={`${attackingTypeName}-${defendingTypeName}`}>
              <TypeMultiplierBox multiplier={multiplier} />
            </div>
          </div>
        )
      } else {
        return (
          <div id={`${attackingTypeName}-${defendingTypeName}`} key={`multiplier-${cellIndex}`}>
            <TypeMultiplierBox multiplier={multiplier} />
          </div>
        )
      }
    })

    return (
      <div className="flex flex-col" key={`table-cell-${index}`}>
        {tableCells}
      </div>
    )
  })

  const tooltips = extractedInformation?.map((type, index) => {
    const { typeName: defendingTypeName, typeDefenceInfo: defenceInfo } = type

    return defenceInfo?.map((defendingType, innerIndex) => {
      const { typeName: attackingTypeName, multiplier } = defendingType
      const effectString = multiplierToString(multiplier)
      return (
        <Tooltip
          anchorSelect={`#${attackingTypeName}-${defendingTypeName}`}
          key={`tooltip-${innerIndex}`}
          place="bottom"
        >
          <span className="text-xs">
            {`${formatName(attackingTypeName)} → ${formatName(defendingTypeName)} = ${effectString}`}
          </span>
        </Tooltip>
      )
    })
  })

  return (
    <>
      <div className="overflow-auto">
        <div className="inline-flex">
          <div className="flex flex-col">{finalTypeCards}</div>
          <div className="flex flex-row gap py-[2px] justify-center">{tableColumns}</div>
        </div>
      </div>

      <>{tooltips}</>
    </>
  )
}

export default TypeChartFull
