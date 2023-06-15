import React from 'react'
import { NavLink } from 'react-router-dom'
import TypeCard from './TypeCard'
import formatName from '../utils/NameFormatting'

const PokeCardV2 = ({ pokemonData }) => {
  const { name, id, gameSprite, types } = pokemonData

  if (gameSprite === null || id >= 10000)
    return

  const typeDiv = types.map((type, index) => {
    const typeName = type.type.name
    return (
      <>
        <TypeCard typeName={typeName} useTextOnly={true} />
        {index !== types.length - 1 && <span> &nbsp; · &nbsp; </span>}
      </>
    )
  })

  return (
    <div className='flex w-full sm:w-1/2 md:w-1/3 mdlg:w-1/5 lg:w-1/4 py-4'>
      <img src={gameSprite} className='w=[70px] h-[45px]' alt={name} />
      <div className='flex flex-col'>
        <div> 
          <NavLink to={`/pokemon/${id}`} className='text-blue-500 font-bold hover:text-red-500 hover:underline duration-300'> 
            { formatName(name) } 
          </NavLink> 
        </div>
        <div className='flex'> {`#${id}`} / &nbsp;{ typeDiv } </div>
      </div>
    </div>
  )
}

export default PokeCardV2