import React from "react";


const TrainingInfo = ({ data }) => {
  const {
    capture_rate,
    base_happiness,
    base_experience,
    growth_rate,
    stats
  } = data

  console.log(data)


  // Formatting the fields from medium-slow to Medium Slow and so on.
  const formatField = field => {
    if (!field) return ''
    const splitWords = field.split('-')
    const properWords = splitWords.map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    return properWords.join(' ')
  }

  // const growthRate = formatGrowthField(growth_rate)
  // console.log(growthRate)

  // let growthRates

  // if (growth_rate === undefined) {
  //   growthRates = ''
  // } else {
  //   console.log(growth_rate)
  //   const splitWords = growth_rate.split('-')
  //   const properWords = splitWords.map(word => {
  //     return word.charAt(0).toUpperCase() + word.slice(1)
  //   })
  //   growthRates = properWords.join(' ')
  // }

  // Find the stats that give EVs
  const evStats = stats.filter(stat => stat.effort > 0)
  const evFormatted = evStats.map(stat => {
    return {name: stat.stat.name, value: stat.effort}
  })
  
  const evString = evFormatted.map(obj => `${obj.value} ${obj.name}`).join(', ');

  const leftColStyle = 'flex justify-end items-center w-4/12 text-right'
  const rightColStyle = 'flex justify-start pl-4 w-8/12 items-center'
  const rowStyle = 'flex flex-row border-t-[1px] border-gray-200 py-2 h-10'

  // const test = growth_rate?.toUpperCase()

  let growth = growth_rate === undefined ? '' : formatField(growth_rate.toString())

  const tableData = [
    { label: "EV Yield", value: evString},
    { label: "Capture Rate", value: capture_rate},
    { label: "Base Friendship", value: base_happiness},
    { label: "Base exp.", value: base_experience},
    { label: "Growth rate", value: growth},
  ]

  const tableDiv = tableData.map(row => {
    return (
      <div className={rowStyle}>
        <div className={leftColStyle}> {row.label} </div>
        <div className={rightColStyle}> {row.value} </div>
      </div>
    )
  })

  return (
    <div className='border-b-[1px]'>
      <div className='font-bold text-3xl mb-10'> Training data </div>
        {tableDiv}
    </div>
  )
}

export default TrainingInfo;