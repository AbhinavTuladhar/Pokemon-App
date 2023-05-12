import { React, useState, useEffect, useMemo } from 'react'
import statCalculator from '../../utils/StatCalculation'


const useStatDetail = (stats) => {
  const maxStatValue = 200
  const statMapping = useMemo(() => {
    return {
      "hp": "HP",
      "attack": "Attack",
      "defense": "Defense",
      "special-attack": "Sp. Atk",
      "special-defense": "Sp. Def",
      "speed": "Speed"
    }
  }, [])
  const [ statDetail, setStatDetail ] = useState([])
  // Finding the maximum and minimum values of each stat.
  useEffect(() => {
    const statValues = stats.map(stat => {
      const statValue = stat.base_stat
      const statName = stat.stat.name
      const properStatName = statMapping[statName]
      const widthValue = `${(statValue / maxStatValue) * 100}%`
      let colour
      if (statValue >= 0 && statValue < 30)
        colour = '#f34444'
      else if (statValue >= 30 && statValue < 60)
        colour = '#ff7f0f'
      else if (statValue >= 60 && statValue < 90)
        colour = '#ffdd57'
      else if (statValue >= 90 && statValue < 120)
        colour = '#a0e515'
      else if (statValue >= 120 && statValue < 150)
        colour = '#23cd5e'
      else if (statValue >= 150)
        colour = '#00c2b8'
      else {
        colour = 'transparent'
      }
      return { name: properStatName, value: statValue, width: widthValue, colour: colour }
    })

    const temp = statCalculator(statValues)
    setStatDetail(() => {
      const details =  statValues.map(obj1 => {
        const obj2 = temp.find(obj => obj.name === obj1.name)
        return {...obj1, ...obj2}
      })
      // This is for dealing with the final row.
      // Find the sum of the base stats
      const baseStatTotal = details.reduce((acc, stat) => acc + stat.value, 0)
      // Push the details of the final row in the array.
      details.push({ 
        name: 'Total', 
        value: baseStatTotal, 
        width: '100%', 
        colour: 'transparent', 
        min: 'Min', 
        max: 'Max'
      })
      return details
    })
  }, [stats, statMapping])

  return statDetail
}

const BaseStat = ({ data }) => {
  const { stats } = data

  const statDetail = useStatDetail(stats)

  const rowValues = statDetail?.map((stat, index) => {
    // Checking for the last index to make the sum of the base stats bold.
    const stringDecoration = index === statDetail.length - 1 ? 'font-bold' : ''

    return (
      <div className='flex flex-row border-t-[1px] border-gray-200 py-2 h-12 max-h-24 pr-2'> 
        <div className='flex justify-end text-right items-center w-1/12 flex-shrink-0'>
          {stat.name}
        </div>
        <div className='flex justify-end pr-4 pl-2 w-1/12 items-center flex-shrink-0'>
          <span className={stringDecoration}> {stat.value} </span>
        </div>
        <div className='w-full flex flex-row justify-start items-center'>
          <div className='my-0 h-1/3 rounded-md ml-2' style={{width: stat.width, minWidth: '2%', backgroundColor: stat.colour}}>
          </div>
        </div>
        <div className='flex justify-end pl-4 w-1/12 items-center'>
          {stat.min}
        </div>
        <div className='flex justify-end pl-4 w-1/12 items-center'>
          {stat.max}
        </div>
      </div>
    )
  })

  return (
    <>
      <div className='text-3xl font-bold mb-4'>
        Base Stats
      </div>
      <div className='border-gray-200 border-b-[1px]'>
        {rowValues}
      </div>
      {/* This is just some informative text. */}
      <div className='mt-4 font-extralight'>
        The ranges shown on the right are for a level 100 Pokémon. Maximum values are based on a beneficial nature, 252 EVs, 31 IVs; minimum values are based on a hindering nature, 0 EVs, 0 IVs.
      </div>
    </>
  )
}

export default BaseStat;