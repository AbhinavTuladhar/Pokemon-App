import React from 'react'
import { NavLink } from 'react-router-dom'
import { FadeInAnimationCard } from './AnimatedContainers'
import TypeCard from './TypeCard'
import formatName from '../utils/NameFormatting'
import '../index.css'

const PokeCardV2 = ({ pokemonData }) => {
  const { name, id, gameSprite, types, nationalNumber } = pokemonData
  const properId = `${'00' + nationalNumber}`.slice(-3)

  if (gameSprite === null || id >= 10157) return

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
    <FadeInAnimationCard className="flex w-full py-4">
      <img src={gameSprite} className="w=[70px] h-[45px]" alt={name} />
      <div className="flex flex-col">
        <div>
          <NavLink to={`/pokemon/${name}`} className="hoverable-link font-bold">
            {formatName(name)}
          </NavLink>
        </div>
        <div className="flex">
          {' '}
          {`#${properId}`} / &nbsp;{typeDiv}{' '}
        </div>
      </div>
    </FadeInAnimationCard>
  )
}

export default PokeCardV2
