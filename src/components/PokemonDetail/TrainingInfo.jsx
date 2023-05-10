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
  // const formatGrowthField = growth_rate => {
  //   if (!growth_rate) return ''
  //   const splitWords = growth_rate.split('-')
  //   const properWords = splitWords.map(word => {
  //     return word.charAt(0).toUpperCase() + word.slice(1)
  //   })
  //   return properWords.join(' ')
  // }

  // const growthRate = formatGrowthField(growth_rate)
  // console.log(growthRate)

  console.log(growth_rate)

  // Find the stats that give EVs
  const evStats = stats.filter(stat => stat.effort > 0)
  console.log(evStats)

  const leftColStyle = 'flex justify-end items-center w-4/12 text-right'
  const rightColStyle = 'flex justify-start pl-4 w-8/12 items-center'
  const rowStyle = 'flex flex-row border-t-[1px] border-gray-200 py-2 h-14'

  const tableData = [
    { label: "Capture Rate", value: capture_rate},
    { label: "Base Friendship", value: base_happiness},
    { label: "Base exp.", value: base_experience},
    // { label: "Growth rate", value: growth_rate.name},
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