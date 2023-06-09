import React from 'react'
import { extractPokemonInformation } from '../utils/extractInfo'
import TypeCard from './TypeCard'
import { NavLink } from 'react-router-dom'

const PokeCardV2 = ({ pokemonData }) => {
  const { name, id, gameSprite, types } = pokemonData

  if (gameSprite === null || id >= 10000)
    return

  return (
    <div className='flex w-1/2 md:w-1/3 mdlg:w-1/5 lg:w-1/4 py-4'>
      <img src={gameSprite} className='w=[70px] h-[45px]' />
      <div className='flex flex-col'>
        <div> 
          <NavLink to={`/pokemon/${id}`} className='text-blue-500 font-bold hover:text-red-500 hover:underline duration-300'> 
            { name } 
          </NavLink> 
        </div>
        <div> {`#${id}`} / {types.map(type => type.type.name)} </div>
      </div>
    </div>
  )
}

export default PokeCardV2