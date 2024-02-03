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
    { ref: '#varieties', text: 'Forms' },
    { ref: '#languages', text: 'Languages' },
  ]
  return (
    <div className="flex flex-row flex-wrap justify-evenly space-x-6 rounded-lg bg-cyan-300 p-4">
      <span className="font-bold text-black"> Contents </span>
      {linkData.map((row, index) => {
        const { ref, text } = row
        return (
          <a href={ref} className="hoverable-link" key={index}>
            {' '}
            {text}{' '}
          </a>
        )
      })}
    </div>
  )
}

export default PageNavigation
