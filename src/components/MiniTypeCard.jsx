import React from 'react'
import { NavLink } from 'react-router-dom'
import typeMapping from '../utils/typeMapping'

const effectivenessMapping = {
  1: { icon: '', colour: 'transparent'},
  2: { icon: '2', colour: 'lime-600'},
  4: { icon: '4', colour: 'lime-500' },
  0.5: { icon: '½', colour: 'red-800'},
  0.25: { icon: '¼', colour: 'red-900'},
  0: { icon: '0', colour: 'black'},
}

const MiniTypeCard = ({ defenceData }) => {
  const { type, multiplier } = defenceData
  // DefenceData takes the form of an object { type: typeName. multiplier: multiplierValue }

  // This background colour is for the type NAME.
  const backgroundColourType = `bg-${typeMapping[type]}`

  const { icon, colour: multiplierColour } = effectivenessMapping[multiplier]

  // This background clour is for the effect multiplier.
  const backgroundColourMultiplier = `bg-${multiplierColour}`
  return (
    <div className={`flex flex-col w-9 text-center`}>
      <div className={`${backgroundColourType} h-9 flex items-center justify-center text-xs px-1 rounded tracking-tight hover:brightness-125 duration-300`}>
        <NavLink to={`/type/${type}`}>
          { type.slice(0, 3).toUpperCase() }
        </NavLink>
      </div>
      <div className={`${backgroundColourMultiplier} h-9 flex items-center justify-center text-center px-1 mt-1 rounded border border-slate-700`}>
        { icon }
      </div>
    </div>
  )
}

export default MiniTypeCard