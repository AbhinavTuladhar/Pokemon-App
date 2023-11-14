import { React, useState, useEffect, useMemo } from 'react'
import SectionTitle from '../../components/SectionTitle'
import TableContainer from '../../components/TableContainer'
import statCalculator from '../../utils/StatCalculation'

/*
Here, we define a custom hook for returning an aray of objects containing:
1. The name of the state,
2. The base value,
3. The maximum value,
4. The minimum value.
*/
const useStatDetail = (stats) => {
  // The max stat value is for the bar graph.
  const maxStatValue = 200

  // Now define a dictionary for mapping the unformatted stat name to its proper name.
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

  // This state variable is for storing the stat details.
  const [statDetail, setStatDetail] = useState([])

  useEffect(() => {
    // Finding the maximum and minimum values of each stat.
    const statValues = stats.map(stat => {
      let colour
      const statValue = stat.base_stat
      const statName = stat.stat.name
      const properStatName = statMapping[statName]

      // This is for determining the width of the bar graph.
      const widthValue = `${(statValue / maxStatValue) * 100}%`

      // Now provide a colour to the bar graph depending on the value of the base stat.
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

    // Now calculate the minimum and maximum stat values using an imported functin.
    const minMaxValues = statCalculator(statValues)

    /*
    This function combines two objects.
    The first object contains the name of the stat and the base stat value -> statValues
    The second object contains the name of the stat and the maximum and minimum values -> minMaxValues.
    These objects are joined using the stat name as the common key-value pair.
    */
    setStatDetail(() => {
      const details = statValues.map(obj1 => {
        const obj2 = minMaxValues.find(obj => obj.name === obj1.name)
        return { ...obj1, ...obj2 }
      })

      /*
      This next bit for dealing with the final row. 
      In the final row, we want the form - 'Total' - (sum of base stats) - transparent bar graph - 'min' - 'max'
      */

      // First we find the sum of the base stats.
      const baseStatTotal = details.reduce((acc, stat) => acc + stat.value, 0)

      // Push the aforementioned details of the final row in the array.
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

  // Fetch the ready-to-use array containing the objects of the stat details.
  const statDetail = useStatDetail(stats)

  const rowValues = statDetail?.map((stat, index) => {
    // Checking for the last index to make the sum of the base stats bold.
    const stringDecoration = index === statDetail.length - 1 ? 'font-bold' : ''

    return (
      <div className='table-row border-t border-gray-200 py-2 h-12 max-h-24 pr-0' key={index}>
        <div className='table-cell pr-2 text-right align-middle border-t border-gray-200'>
          {stat.name}
        </div>
        <div className='table-cell px-1 text-right align-middle border-t border-gray-200'>
          <span className={`${stringDecoration} text-left`}> {stat.value} </span>
        </div>
        <div className='table-cell w-full h-full px-0 mx-0 align-middle border-t border-gray-200'>
          <div className='h-3 my-0 ml-2 rounded' style={{ width: stat.width, minWidth: '0.25em', maxWidth: '100%', backgroundColor: stat.colour }}> &nbsp;
          </div>
        </div>
        <div className='table-cell px-1 pl-3 text-right align-middle border-t border-gray-200'>
          {stat.min}
        </div>
        <div className='table-cell px-1 text-right align-middle border-t border-gray-200'>
          {stat.max}
        </div>
      </div>
    )
  })

  return (
    <>
      <SectionTitle text={'Base Stats'} />
      <TableContainer child={rowValues} />
      {/* This is just some informative text. */}
      <div className='mt-4 font-extralight'>
        The ranges shown on the right are for a level 100 Pokémon. Maximum values are based on a beneficial nature, 252 EVs, 31 IVs; minimum values are based on a hindering nature, 0 EVs, 0 IVs.
      </div>
    </>
  )
}

export default BaseStat;