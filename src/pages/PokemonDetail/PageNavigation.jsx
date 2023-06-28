import React from 'react'



const PageNavigation = () => {
  const linkData = [
    { ref: '#info', text: 'Info' },
    { ref: '#base-stats', text: 'Base stats' },
    { ref: '#evolution-chain', text: 'Evolution chart' },
    { ref: '#pokedex-entries', text: 'Pokédex entries' },
    { ref: '#moves-learned', text: 'Moves learned' },
    { ref: '#sprite-table', text: 'Sprites' },
    { ref: '#locations', text: 'Locations' },
    { ref: '#varieties', text: 'Forms' }
  ]
  return (
    <div className='bg-cyan-300 flex flex-row flex-wrap justify-evenly space-x-6 p-4 rounded-lg'>
      <span className='font-bold text-black'> Contents </span>
      {linkData.map(row => {
        const { ref, text } = row
        return (
          <a href={ref} className='hoverable-link'> { text } </a>
        )
      })}
    </div>
  )
}

export default PageNavigation