import React from 'react'
import TypeCard from '../TypeCard'

const PokeDexData = ({ pokemonData }) => {
  const { id, types, genus, height, weight, abilities} = pokemonData

  const formattedHeight = `${(height*0.1).toFixed(2)} m`
  const formattedWeight = `${(weight*0.1).toFixed(2)} kg`

  const typeNames = types.map(type => type.type.name)
  const abilityNames = abilities.map(ability => {
    const name = ability.ability.name
    const hiddenExtraText = ability.is_hidden === true ? ' (hidden)' : ''
    return name.charAt(0).toUpperCase() + name.slice(1) + hiddenExtraText
  })

  const typeDiv = typeNames.map(typeName => <TypeCard typeName={typeName} />)
  const abilityList = abilityNames.map(ability => <li> {ability} </li>)

  const rowStyle = 'flex flex-row border-t-[1px] border-gray-200 py-2 h-12 max-h-24'
  const lastRowStyle = 'flex flex-row border-t-[1px] border-gray-200 py-2 min-h-14 max-h-24'
  const leftColStyle = 'flex justify-end text-right items-center w-3/12'
  const rightColStyle = 'flex justify-start pl-4 w-9/12 items-center'

  return (
    <>
      <div className='font-bold text-3xl mb-10'>
        Pokédex data
      </div>
      <div className='flex flex-col'>
        <div className={rowStyle}>
          <div className={leftColStyle}> National no. </div>
          <div className={rightColStyle}> {id} </div>
        </div>
        <div className={rowStyle}>
          <div className={leftColStyle}> Type </div>
          <div className={rightColStyle}> {typeDiv} </div>
        </div>
        <div className={rowStyle}>
          <div className={leftColStyle}> Species </div>
          <div className={rightColStyle}> {genus} </div>
        </div>
        <div className={rowStyle}>
          <div className={leftColStyle}> Height </div>
          <div className={rightColStyle}> {formattedHeight} </div>
        </div>
        <div className={rowStyle}>
          <div className={leftColStyle}> Weight </div>
          <div className={rightColStyle}> {formattedWeight} </div>
        </div>
        <div className={`${lastRowStyle} border-b-[1px]`}>
          <div className={leftColStyle}> Abilities </div>
          <div className={rightColStyle}>
            <ol className='list-inside list-decimal'>
              {abilityList}
            </ol>
          </div>
        </div>
      </div>
    </>
  )
}

export default PokeDexData;