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
    <div className='flex flex-row flex-wrap p-4 space-x-6 rounded-lg bg-cyan-300 justify-evenly'>
      <span className='font-bold text-black'> Contents </span>
      {linkData.map(row => {
        const { ref, text } = row
        return (
          <a href={ref} className='hoverable-link'> {text} </a>
        )
      })}
    </div>
  )
}

export default PageNavigation