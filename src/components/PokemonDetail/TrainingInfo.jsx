import React from "react";


const TrainingInfo = ({ data }) => {
  const {
    capture_rate,
    base_happiness,
    base_experience,
    growth_rate,
    stats
  } = data

  // Formatting the fields from medium-slow to Medium Slow and so on.
  const formatField = field => {
    if (!field) return ''
    const splitWords = field.split('-')
    const properWords = splitWords.map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    return properWords.join(' ')
  }

  // Format the growth rate field
  const growth = growth_rate === undefined ? '' : formatField(growth_rate.toString())

  // Find the stats that give EVs
  const evStats = stats.filter(stat => stat.effort > 0)
  const evFormatted = evStats.map(stat => {
    // First format the stat field. hp -> HP, rest => special-attack => Special Attack
    const statName = stat.stat.name
    const formattedStatName = statName === 'hp' ? 'HP': formatField(stat.stat.name.toString())
    return {name: formattedStatName, value: stat.effort}
  })
  
  // Joining all the EV stats given by commas.
  const evString = evFormatted.map(obj => `${obj.value} ${obj.name}`).join(', ');

  // Define all the things that is to be displayed.
  const tableData = [
    { label: "EV Yield", value: evString},
    { label: "Capture Rate", value: capture_rate},
    { label: "Base Friendship", value: base_happiness},
    { label: "Base exp.", value: base_experience},
    { label: "Growth rate", value: growth},
  ]

  const tableDiv = tableData.map(row => {
    return (
      <div className='flex flex-row border-t-[1px] border-gray-200 py-2 h-12'>
        <div className='flex justify-end items-center w-4/12 text-right'> {row.label} </div>
        <div className='flex justify-start pl-4 w-8/12 items-center'> {row.value} </div>
      </div>
    )
  })

  return (
    <div className='border-b-[1px] w-full'>
      <div className='font-bold text-3xl mb-10'> Training data </div>
        {tableDiv}
    </div>
  )
}

export default TrainingInfo;