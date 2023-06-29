import React from 'react'

const effectivenessMapping = {
  1: { icon: '', colour: 'transparent'},
  2: { icon: '2', colour: 'lime-600'},
  4: { icon: '4', colour: 'lime-500' },
  0.5: { icon: '½', colour: 'red-800'},
  0.25: { icon: '¼', colour: 'red-900'},
  0: { icon: '0', colour: 'black'},
}

const TypeMultiplierBox = ({ multiplier }) => {
  const { icon, colour: multiplierColour } = effectivenessMapping[multiplier]
  // Provide a distinct background colours for each effectiveness value
  const backgroundColourMultiplier = `bg-${multiplierColour}`

  return (
    <div className={`${backgroundColourMultiplier} h-9 flex items-center justify-center text-center px-1 mt-1 rounded border border-slate-700`}>
      { icon }
    </div>
  )
}

export default TypeMultiplierBox