import React from 'react'
import { NavLink } from 'react-router-dom'
import typeMapping from '../utils/typeMapping'

const MiniTypeCard = ({ typeName }) => {
  // This background colour is for the type NAME.
  const backgroundColourType = `bg-${typeMapping[typeName]}`

  return (
    <div className={`${backgroundColourType} h-9 w-9 flex items-center justify-center text-xs px-1 rounded tracking-tight hover:brightness-125 duration-300`}>
      <NavLink to={`/types/${typeName}`}>
        { typeName.slice(0, 3).toUpperCase() }
      </NavLink>
    </div>
  )
}

export default MiniTypeCard