import React from 'react'
import SectionTitle from '../../components/SectionTitle'
import TableContainer from '../../components/TableContainer'

const TrainingInfo = ({ data }) => {
  const { capture_rate, base_happiness, base_experience, growth_rate, stats } = data

  // Formatting the fields from medium-slow to Medium Slow and so on.
  const formatField = (field) => {
    if (!field) return ''
    const splitWords = field.split('-')
    const properWords = splitWords.map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    return properWords.join(' ')
  }

  // Format the growth rate field
  const growth = growth_rate === undefined ? '' : formatField(growth_rate.toString())

  // Find the stats that give EVs
  const evStats = stats.filter((stat) => stat.effort > 0)
  const evFormatted = evStats.map((stat) => {
    // First format the stat field. hp -> HP, rest => special-attack => Special Attack
    const statName = stat.stat.name
    const formattedStatName = statName === 'hp' ? 'HP' : formatField(stat.stat.name.toString())
    return { name: formattedStatName, value: stat.effort }
  })

  // Joining all the EV stats given by commas.
  const evString = evFormatted.map((obj) => `${obj.value} ${obj.name}`).join(', ')

  // Define all the things that is to be displayed.
  const tableData = [
    { label: 'EV Yield', value: evString },
    { label: 'Capture Rate', value: capture_rate },
    { label: 'Base Friendship', value: base_happiness },
    { label: 'Base exp.', value: base_experience },
    { label: 'Growth rate', value: growth },
  ]

  const tableDiv = tableData.map((row, rowIndex) => {
    return (
      <div className="table-row h-12 border-t border-gray-200 py-2" key={rowIndex}>
        <div className="table-cell w-4/12 border-t border-gray-200 text-right align-middle">
          {' '}
          {row.label}{' '}
        </div>
        <div className="table-cell items-center border-t border-gray-200 pl-4 align-middle">
          {' '}
          {row.value}{' '}
        </div>
      </div>
    )
  })

  return (
    <>
      <SectionTitle text={'Training Data'} />
      <TableContainer child={tableDiv} />
    </>
  )
}

export default TrainingInfo
