import React from 'react'
import { NavLink } from 'react-router-dom'
import typeMapping from '../utils/typeMapping'

const TypeCard = ( { typeName }) => {
  const typeKey = typeName?.toLowerCase(); // convert typeName to lowercase
  const backgroundColour = 'bg-' + typeMapping[typeKey]
  const divStyle = `${backgroundColour} w-20 px-2 py-1 flex flex-col flex-wrap justify-center items-center rounded-md my-0 mx-1 hover:brightness-110 duration-200 text-sm`;
  const targetLink = `/types/${typeName}`

  return(
    <div className={divStyle}>
      <NavLink to={targetLink}>
        {typeName?.toUpperCase()}
      </NavLink>
    </div>
  )
}

export default TypeCard;