import react from 'react'

const BaseStat = ({ data }) => {
  const { stats } = data

  const statValues = stats.map(stat => {
    const statValue = stat.base_stat
    const statName = stat.stat.name
    return { name: statName, value: statValue}
  })

  const rowValues = statValues.map(stat => {
    return (
      <div className='flex flex-row border-t-[1px] border-gray-200 py-2 h-12 max-h-24'> 
        <div className='flex justify-end text-right items-center w-3/12'>
          {stat.name}
        </div>
        <div className='flex justify-start pl-4 w-9/12 items-center'>
          {stat.value}
        </div>
      </div>
    )
  })

  return rowValues
}

export default BaseStat;