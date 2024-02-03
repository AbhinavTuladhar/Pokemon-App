import React from 'react'
import MiniTypeCard from '../../components/MiniTypeCard'
import TypeCard from '../../components/TypeCard'
import TypeMultiplierBox from '../../components/TypeMultiplierBox'
import calculateOffensiveTypeEffectiveness from '../../utils/typeEffectivenessOffensive'
import { Tooltip } from 'react-tooltip'
import multiplierToString from '../../utils/multiplierToString'
import formatName from '../../utils/NameFormatting'

const DualTypeChart = ({ data }) => {
  const { typeName: mainType } = data
  const typeList = [
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

  const toolTips = []

  // Calculate all the dual-type combinations possible
  const typeRows = typeList.flatMap((type) => {
    return typeList.map((innerType) => {
      return [type, innerType]
    })
  })

  // This is for the first row.
  const firstRow = [[], ...typeList]?.map((type, index) => {
    if (index === 0) {
      return <div className="w-20 mx-1 border h-9 border-slate-900" key={index} />
    } else {
      return <MiniTypeCard typeName={type} key={index} />
    }
  })

  // To take into account the row header.
  const dummy = ['', '']

  const tableRows = typeList?.map((type, rowIndex) => {
    // For each row, we want only those subarrays in which the first item is equal to `type`
    const cellData = typeRows?.filter((subarray) => subarray === null || subarray[0] === type)

    const cellDivs = [dummy, ...cellData]?.map((arr, cellIndex) => {
      const [firstType, secondType] = arr
      const functionArgs = {
        defendingTypeCombination: arr,
        attackingTypeInfo: data,
      }
      const combinedTypeString = arr.map((type) => formatName(type)).join('/')
      const multiplierValue =
        firstType !== '' || firstType !== null
          ? calculateOffensiveTypeEffectiveness(functionArgs)
          : 1
      const multiplierString = multiplierToString(multiplierValue)

      toolTips.push(
        <Tooltip anchorSelect={`#${firstType || 'a'}-${secondType || 'b'}`}>
          <span className="text-xs">{`${formatName(mainType)} → ${combinedTypeString} = ${multiplierString}`}</span>
        </Tooltip>,
      )

      if (cellIndex === 0) {
        return <TypeCard typeName={type} className="h-9" key={cellIndex} />
      } else if (firstType === secondType) {
        return <TypeMultiplierBox multiplier={1} className="bg-gray-700" key={cellIndex} />
      } else {
        return (
          <div id={`${firstType}-${secondType}`} key={cellIndex}>
            <TypeMultiplierBox multiplier={multiplierValue} />
          </div>
        )
      }
    })

    return (
      <div className="flex flex-row gap-x items-end" key={rowIndex}>
        {cellDivs}
      </div>
    )
  })

  return (
    <>
      <div className="overflow-auto">
        <div className="inline-flex flex-col">
          <div className="flex flex-row gap-x">{firstRow}</div>
          <>{tableRows}</>
          <>{toolTips}</>
        </div>
      </div>
    </>
  )
}

export default DualTypeChart
