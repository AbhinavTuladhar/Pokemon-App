import React from 'react'
import { NavLink } from 'react-router-dom'
import typeMapping from '../utils/typeMapping'

const TypeCard = ({ typeName, useTextOnly, className }) => {
  const typeKey = typeName?.toLowerCase() // convert typeName to lowercase
  const backgroundColour = 'bg-' + typeMapping[typeKey]
  const targetLink = `/types/${typeName}`

  if (useTextOnly) {
    const fontColour = 'text-' + typeMapping[typeKey]
    const properName = typeName.charAt(0).toUpperCase() + typeName.slice(1)
    return (
      <span className={`${fontColour} w-min hover:underline`}>
        <NavLink to={targetLink}>{properName}</NavLink>
      </span>
    )
  }
  return (
    <div
      className={`${backgroundColour} ${className} mx-1 my-0 flex w-20 flex-col flex-wrap items-center justify-center rounded-md px-2 py-1 text-sm duration-200 hover:brightness-110`}
    >
      <NavLink to={targetLink}>{typeName?.toUpperCase()}</NavLink>
    </div>
  )
}

export default TypeCard
