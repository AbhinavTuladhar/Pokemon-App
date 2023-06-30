import React from 'react'
import MiniTypeCard from '../../components/MiniTypeCard'
import TypeCard from '../../components/TypeCard'
import TypeMultiplierBox from '../../components/TypeMultiplierBox'
import calculateOffensiveTypeEffectiveness from '../../utils/typeEffectivenessOffensive'

const RowContainer = ({ children }) => {
  return (
    <div className='flex flex-wrap flex-row gap-x-[1px]'>
      { children }
    </div>
  )
}

const DualTypeChart = ({ data }) => {
  const typeList = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
  ]
  
  // Calculate all the dual-type combinations possible
  const typeRows = typeList.flatMap(type => {
    return typeList
      .map(innerType => {
        return [type, innerType]
      })
  })

  // This is for the first row.
  const firstRow = [[], ...typeList].map((type, index) => {
    if (index === 0) {
      return <div className='h-9 w-20 border border-slate-900 mx-1' />
    } else {
      return <MiniTypeCard typeName={type} />
    }
  })

  // To take into account the row header.
  const dummy = ['', '']

  const tableRows = typeList.map((type, rowIndex) => {
    // For each row, we want only those subarrays in which the first item is equal to `type`
    const cellData = typeRows.filter(subarray => subarray === null || subarray[0] === type)

    const cellDivs = [dummy, ...cellData].map((arr, cellIndex) => {
      const [firstType, secondType] = arr
      const functionArgs = {
        defendingTypeCombination: arr,
        attackingTypeInfo: data
      }
      const multiplierValue = firstType !== '' || firstType !== null ? calculateOffensiveTypeEffectiveness(functionArgs) : 1

      if (cellIndex === 0) {
        return <TypeCard typeName={type} className='h-9' />
      } else if (firstType === secondType) {
        return <TypeMultiplierBox multiplier={1} className='bg-gray-700' />
      } else {
        return <TypeMultiplierBox multiplier={multiplierValue} />
      }
    })

    return (
      <div className='flex flex-row gap-x-[1px] items-end'>
        { cellDivs }
      </div>
    )
  })

  return (
    <>
      <div className='overflow-auto'>
        <div className='inline-flex flex-col'>
          <div className='flex flex-row gap-x-[1px]'>
            { firstRow }
          </div>
          <>
            { tableRows }
          </>
        </div>
      </div>
    </>
  )
}

export default DualTypeChart