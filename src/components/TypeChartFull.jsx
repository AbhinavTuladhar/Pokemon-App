import React from 'react'
import { useQuery } from 'react-query'
import Skeleton from 'react-loading-skeleton'
import TypeCard from './TypeCard'
import MiniTypeCard from './MiniTypeCard'
import TypeMultiplierBox from './TypeMultiplierBox'
import { extractTypeInformation } from '../utils/extractInfo'
import fetchData from '../utils/fetchData'
import calculateTypeEffectiveness from '../utils/typeEffectiveness'

const TypeChartFull = () => {
  const typeList = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground',
    'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
  ]
  const typeUrls = typeList.map(type => `https://pokeapi.co/api/v2/type/${type}`)

  /*
  Step 1: Extract type information
  Step 2: Calculate the type chart, and return an object containing the type chart with the defending
  type name
  Step 3: Properly format the type chart object.
  */
  const transformData = data => {
    return data
      .map(type => extractTypeInformation(type))
      .map(type => {
        const { name: typeName } = type
        const typeChart = calculateTypeEffectiveness([type])
        return {
          typeName,
          typeChart
        }
      })
      .map(typeData => {
        const { typeName, typeChart } = typeData
        const typeDefenceInfo = Object.entries(typeChart).map(([typeName, multiplier]) => ({
          typeName, multiplier
        }))
        return { typeName, typeDefenceInfo }
      })
  }
  const { data: extractedInformation = [], isLoading } = useQuery(
    ['typeChart', typeList],
    () => Promise.all(typeUrls.map(fetchData)),
    { staleTime: Infinity, cacheTime: Infinity, select: transformData }
  )

  if (isLoading) {
    return <Skeleton width='90%' height='20rem' containerClassName='flex-1 w-full flex justify-end' />
  }

  // To show the defending and attacking types.
  const cornerDiv = (
    <div className='flex flex-col items-center justify-center w-20 text-xs border rounded-md h-9 border-slate-700'>
      <span> DEFENCE → </span>
      <span> ATTACK ↴ </span>
    </div>
  )

  // An empty array at the beginning for a div containing info about the axes.
  const fullTypeCards = [[], ...typeList].map((type, index) => {
    if (index === 0) {
      return cornerDiv
    } else {
      return <TypeCard typeName={type} className='h-9' />
    }
  })

  const finalTypeCards = fullTypeCards.map((typeCard, index) => (
    <div className='flex justify-center items-center my-[2px]' key={index}>
      {typeCard}
    </div>
  ))

  // Make a dummy object in order to account for the first row.
  const dummy = [{ typeName: '', typeDefenceInfo: [{ typeName: '', multiplier: 1 }] }]

  const tableColumns = [dummy, ...extractedInformation]?.map((type, index) => {
    const { typeName, typeDefenceInfo: defenceInfo } = type

    const tableCells = defenceInfo?.map((defendingType, cellIndex) => {
      const { multiplier } = defendingType
      if (cellIndex === 0) {
        return (
          <div key={cellIndex}>
            <MiniTypeCard typeName={typeName} />
            <TypeMultiplierBox multiplier={multiplier} />
          </div>
        )
      } else {
        return <TypeMultiplierBox multiplier={multiplier} key={cellIndex} />
      }
    })

    return (
      <div className='flex flex-col' key={index}>
        {tableCells}
      </div>
    )
  })

  return (
    <>
      <div className='overflow-auto'>
        <div className='inline-flex'>
          <div className='flex flex-col'>
            {finalTypeCards}
          </div>
          <div className='flex flex-row gap-[1px] py-[2px] justify-center'>
            {tableColumns}
          </div>
        </div>
      </div>
    </>
  )
}

export default TypeChartFull