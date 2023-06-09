import React from 'react'
import { NavLink } from 'react-router-dom'
import typeMapping from '../utils/typeMapping'

const TypeCard = ( { typeName, useTextOnly, className }) => {
  const typeKey = typeName?.toLowerCase(); // convert typeName to lowercase
  const backgroundColour = 'bg-' + typeMapping[typeKey]
  const targetLink = `/types/${typeName}`
  
  if (useTextOnly) {
    const fontColour = 'text-' + typeMapping[typeKey]
    const properName = typeName.charAt(0).toUpperCase() + typeName.slice(1)
    return (
      <span className={`${fontColour} hover:underline w-min`}>
        <NavLink to={targetLink}>
          {properName}
        </NavLink>
      </span>
    )
  } else {
    return(
      <div className={`${backgroundColour} ${className} w-20 px-2 py-1 flex flex-col flex-wrap justify-center items-center rounded-md my-0 mx-1 hover:brightness-110 duration-200 text-sm`}>
        <NavLink to={targetLink}>
          {typeName?.toUpperCase()}
        </NavLink>
      </div>
    )
  }
}

export default TypeCard;