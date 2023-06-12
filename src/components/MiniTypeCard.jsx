import React from 'react'
import { NavLink } from 'react-router-dom'
import typeMapping from '../utils/typeMapping'

const MiniTypeCard = ({ defenceData }) => {
  const { type, multiplier } = defenceData
  // DefenceData takes the form of an object { type: typeName. multiplier: multiplierValue }
  const backgroundColour = `bg-${typeMapping[type]}`
  return (
    <div className={`flex flex-col w-9 text-center`}>
      <div className={`${backgroundColour} text-xs px-1 py-3 rounded tracking-tight hover:brightness-125 duration-300`}>
        <NavLink to={`/type/${type}`}>
          { type.slice(0, 3).toUpperCase() }
        </NavLink>
      </div>
      <div className='text-center px-1 py-2 mt-1 rounded border border-slate-700'>
        { multiplier }
      </div>
    </div>
  )
}

export default MiniTypeCard