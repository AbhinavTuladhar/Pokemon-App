import React from 'react'
import { NavLink } from 'react-router-dom'
import { FadeInAnimationCard } from './AnimatedContainers'
import TypeCard from './TypeCard'
import formatName from '../utils/NameFormatting'
import '../index.css'

const PokeCardV2 = ({ pokemonData }) => {
  const { name, id, gameSprite, types, nationalNumber } = pokemonData
  const properId = `${'00' + nationalNumber}`.slice(-3)

  if (gameSprite === null || id >= 10157)
    return

  const typeDiv = types.map((type, index) => {
    const typeName = type.type.name
    return (
      <div key={index}>
        <TypeCard typeName={typeName} useTextOnly={true} />
        {index !== types.length - 1 && <span> &nbsp; · &nbsp; </span>}
      </div>
    )
  })

  return (
    <FadeInAnimationCard className='flex w-full py-4 sm:w-5/12 md:w-1/3 mdlg:w-1/5 lg:w-1/4'>
      <img src={gameSprite} className='w=[70px] h-[45px]' alt={name} />
      <div className='flex flex-col'>
        <div>
          <NavLink to={`/pokemon/${name}`} className='font-bold hoverable-link'>
            {formatName(name)}
          </NavLink>
        </div>
        <div className='flex'> {`#${properId}`} / &nbsp;{typeDiv} </div>
      </div>
    </FadeInAnimationCard>
  )
}

export default PokeCardV2