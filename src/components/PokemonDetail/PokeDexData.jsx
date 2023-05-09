import React from 'react'
import TypeCard from '../TypeCard'

const PokeDexData = ({ pokemonData }) => {
  const { id, types, genus, height, weight, abilities} = pokemonData

  const formattedHeight = `${height*0.1} m`
  const formattedWeight = `${weight*0.1} kg`

  const typeNames = types.map(type => type.type.name)
  const abilityNames = abilities.map(ability => {
    const name = ability.ability.name
    return name.charAt(0).toUpperCase() + name.slice(1)
  })

  const typeDiv = typeNames.map(typeName => <TypeCard typeName={typeName} />)
  const abilityList = abilityNames.map(ability => <li> {ability} </li>)


  // const dataTableInfo = [
  //   ["National no.", id],
  //   ["Type", typeDiv],
  //   ["Species", genus],
  //   ["Height", height],
  //   ["Weight", weight],
  //   ["abilities", abilities],
  // ]

  // const tableInformation = dataTableInfo.map(row => {
  //   return (
  //     <div>
  //       {row[0]} - {row[1]}
  //     </div>
  //   )
  // })

  return (
    <div>
      <div className='font-bold text-3xl mb-10'>
        Pokédex data
      </div>
      <div className='grid grid-cols-2 auto-rows-fr gap-y-0 py-4'>
        <div className='col-start-1 justify-end items-center flex text-right pr-2 border-t-[1px] border-gray-400'>
          National number
        </div>
        <div className='col-start-2 items-center flex pl-2 border-t-[1px] border-gray-400'>
          {id}
        </div>
        <div className='col-start-1 text-right pr-2 justify-end items-center flex border-t-[1px] border-gray-400'>
          Type
        </div>
        <div className='col-start-2 items-center flex pl-2 flex-row border-t-[1px] border-gray-400 py-[-15px]'>
          {typeDiv}
        </div>
        <div className='col-start-1 justify-end items-center flex text-right pr-2 border-t-[1px] border-gray-400'>
          Species
        </div>
        <div className='col-start-2 items-center flex pl-2 border-t-[1px] border-gray-400'>
          {genus}
        </div>
        <div className='col-start-1 justify-end items-center flex text-right pr-2 border-t-[1px] border-gray-400'>
          Height
        </div>
        <div className='col-start-2 items-center flex pl-2 border-t-[1px] border-gray-400'>
          {formattedHeight}
        </div>
        <div className='col-start-1 justify-end items-center flex text-right pr-2 border-t-[1px] border-gray-400'>
          Weight
        </div>
        <div className='col-start-2 items-center flex pl-2 border-t-[1px] border-gray-400'>
          {formattedWeight}
        </div>
        <div className='col-start-1 justify-end items-center flex text-right pr-2 border-y-[1px] border-gray-400'>
          Abilities
        </div>
        <div className='col-start-2 items-center flex pl-2 border-y-[1px] border-gray-400'>
          <ol className='list-decimal list-inside'>
            {abilityList}
          </ol>
        </div>
      </div>
      {/* <div>
        <ol className='list-decimal'>
          {abilityList} 
        </ol>
      </div>
      <div className='flex flex-row'>
        {typeDiv}
      </div> */}
    </div>
  )
}

export default PokeDexData;