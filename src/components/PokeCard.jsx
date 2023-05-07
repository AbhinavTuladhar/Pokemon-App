import { React, useEffect, useState} from 'react';
import axios from 'axios'
import { NavLink } from 'react-router-dom'

const PokeCard = ({ data }) => {
  const {
    id,
    name,
    types,
    sprites: { other : { 'official-artwork' : { front_default }}}
  } = data

  if (id % 100 === 0)
    console.log(data)

  const properName = name.charAt(0).toUpperCase() + name.slice(1);

  const finalName = properName.split('-').length > 1 ?
    properName.split('-')[0] :
    properName

  let typeList = types.map(type => {
    return type.type.name
  })

  typeList = typeList.join(', ')

  const targetLink = `/pokemon/${id}`

  return (
    <div className='border border-slate-200 flex flex-col justify-center items-center md:w-2/12 sm:w-1/3 mx-auto py-2'>
      <div className='font-bold'>
        #{id}
      </div>
      <NavLink to={targetLink} className='font-extrabold text-xl'>
        {finalName}
      </NavLink>
      <div>
        <img src={front_default} className='h-[100px]' alt={name} />
      </div>
      <div>
        {typeList}
      </div>
    </div>
  )
}

export default PokeCard;