import react from 'react'

const BaseStat = ({ data }) => {
  const { stats } = data
  const maxStatValue = 180

  const statMapping = {
    "hp": "HP",
    "attack": "Attack",
    "defense": "Defense",
    "special-attack": "Sp. Atk",
    "special-defense": "Sp. Def",
    "speed": "Speed"
  }

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
    else 
      colour = '#00c2b8'
    return { name: properStatName, value: statValue, width: widthValue, colour: colour }
  })

  const rowValues = statValues.map(stat => {
    return (
      <div className='flex flex-row border-t-[1px] border-gray-200 py-2 h-12 max-h-24'> 
        <div className='flex justify-end text-right items-center w-2/12'>
          {stat.name}
        </div>
        <div className='flex justify-start pl-4 w-1/12 items-center'>
          {stat.value}
        </div>
        <div className='w-full flex flex-row justify-start items-center'>
          <div className='my-0 h-1/3 rounded-md ml-2' style={{width: stat.width, minWidth: '2%', backgroundColor: stat.colour}}>
          </div>
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
    </>
  )
}

export default BaseStat;