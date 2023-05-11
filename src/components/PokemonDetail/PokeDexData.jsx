import React from 'react'
import TypeCard from '../TypeCard'

const PokeDexData = ({ pokemonData }) => {
  const { id, types, genus, height, weight, abilities, pokedex_numbers } = pokemonData

  console.log('Greetings from pokeDexdata')
  console.log(pokedex_numbers)

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
  const abilityListFinal = (
    <ol className='list-inside list-decimal'>
      {abilityList}
    </ol>
  )

  // Now dealing with the Pokedex numbers for each region.
  // Omit the national region number ssince it has already been covered.
  const nonNationalValues = pokedex_numbers?.filter(entry => entry.pokedex.name !== 'national')
  const regionNumberValues = nonNationalValues?.map(entry => {
    const regionName = entry.pokedex.name
    return { number: entry.entry_number, region: regionName }
  })
  
  const regionNumberList = regionNumberValues?.map((number, index) => {
    return (
      <li key={index}> {number.number} ({number.region}) </li>
    )
  })
  const regionNumberListFinal = (
    <ul className='list-inside list-none'>
      {regionNumberList}
    </ul>
  )

  const tableData = [
    { label: 'National no.', value: id},
    { label: 'Type', value: typeDiv },
    { label: 'Species', value: genus },
    { label: 'Height', value: formattedHeight },
    { label: 'Weight', value: formattedWeight },
    { label: 'Abilities', value: abilityListFinal },
    { label: 'Regional no.', value: regionNumberListFinal}
  ]

  const tableEntries = tableData.map(row => {
    const spacing = row.label === 'Abilities' || row.label === 'Regional no.' ? 'min-h-14 max-h-screen' : 'h-12'
    return (
      <div className={`flex flex-row border-t-[1px] border-gray-200 py-2 ${spacing}`}>
        <div className='flex justify-end text-right items-center w-3/12'>
          {row.label}
        </div>
        <div className='flex justify-start pl-4 w-9/12 items-center'>
          {row.value}
        </div>
      </div>
    )
  })

  return (
    <>
      <div className='font-bold text-3xl mb-10'>
        Pokédex data
      </div>
      <div className='flex flex-col border-b-[1px]'>
        {tableEntries}
      </div>
    </>
  )
}

export default PokeDexData;