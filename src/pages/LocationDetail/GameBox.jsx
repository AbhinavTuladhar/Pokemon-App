import React from 'react'

const gameMapping = {
  'red': { icon: 'R', backgroundColour: 'bg-red-500' },
  'blue': { icon: 'B', backgroundColour: 'bg-blue-500' },
  'yellow': { icon: 'Y', backgroundColour: 'bg-yellow-500' },

  'gold': { icon: 'G', backgroundColour: 'bg-amber-200' },
  'crystal': { icon: 'C', backgroundColour: 'bg-indigo-100' },
  'silver': { icon: 'S', backgroundColour: 'bg-cyan-200' },

  'sapphire': { icon: 'S', backgroundColour: 'bg-blue-500' },
  'ruby': { icon: 'R', backgroundColour: 'bg-red-500' },
  'emerald': { icon: 'E', backgroundColour: 'bg-green-500' },
  'leafgreen': { icon: 'LG', backgroundColour: 'bg-green-400' },
  'firered': { icon: 'FR', backgroundColour: 'bg-red-500' },

  'diamond': { icon: 'D', backgroundColour: 'bg-indigo-300' },
  'pearl': { icon: 'P', backgroundColour: 'bg-red-300' },
  'platinum': { icon: 'Pt', backgroundColour: 'bg-indigo-100' },
  'heartgold': { icon: 'HG', backgroundColour: 'bg-amber-200' },
  'soulsilver': { icon: 'SS', backgroundColour: 'bg-indigo-100' },

  'black': { icon: 'B', backgroundColour: 'bg-gray-700' },
  'white': { icon: 'W', backgroundColour: 'bg-gray-200' },
  'black-2': { icon: 'B2', backgroundColour: 'bg-gray-800' },
  'white-2': { icon: 'W2', backgroundColour: 'bg-gray-300' },

  'x': { icon: 'X', backgroundColour: 'bg-blue-500' },
  'y': { icon: 'Y', backgroundColour: 'bg-red-500' },
  'omega-ruby': { icon: 'OR', backgroundColour: 'bg-red-500' },
  'alpha-sapphire': { icon: 'AS', backgroundColour: 'bg-blue-500' },
}

const GameBox = ({ gameName, generation, activeFlag }) => {
  // console.log({gameName})
  const { icon = '', backgroundColour = '' } = gameMapping[gameName]

  return (
    <div className={`${activeFlag && backgroundColour} w-14 h-14 text-sm font-bold flex justify-center items-center border border-slate-200`}>
      { icon }
    </div>
  )
}

export default GameBox