import React from 'react'
import { NavLink } from 'react-router-dom'
import typeMapping from '../utils/typeMapping'

const MiniTypeCard = ({ typeName }) => {
  // This background colour is for the type NAME.
  const backgroundColourType = `bg-${typeMapping[typeName]}`

  return (
    <div
      className={`${backgroundColourType} flex h-9 w-9 items-center justify-center rounded px-1 text-xs tracking-tight duration-300 hover:brightness-125`}
    >
      <NavLink to={`/types/${typeName}`}>{typeName.slice(0, 3).toUpperCase()}</NavLink>
    </div>
  )
}

export default MiniTypeCard
