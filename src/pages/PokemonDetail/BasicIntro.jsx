import React from 'react'
import TypeCard from '../../components/TypeCard'
import formatName from '../../utils/NameFormatting'
import generationMappingV2 from '../../utils/generationMappingV2'
import OneLineSkeleton from '../../components/OneLineSkeleton'

const BasicIntro = ({ pokemonData }) => {
  const { id, pokedex_numbers, name, types, genus } = pokemonData

  // Don't display for the other Pokemon forms.
  if (id >= 10_000) return

  // Use the national number instead of the ID numbers to take into account the forms.
  // const generationIntroduced = generationMappingV2(pokedex_numbers?.slice(0, 1).entry_number)
  const generationIntroduced = generationMappingV2(id)
  // Use only the first word for the other forms.
  const properName = formatName(name).split(' ')[0]

  const typeDiv = types.map((type, index) => {
    const typeName = type.type.name
    return (
      <>
        <TypeCard typeName={typeName} useTextOnly={true} />
        {index !== types.length - 1 && <span> / </span>}
      </>
    )
  })


  return (
    <div className='mt-8 mb-2 flex flex-row flex-wrap'>
      {
        genus
        ?
        <span>
          {`${properName} is a`} &nbsp;
          {typeDiv} &nbsp;
          {`type Pokemon introduced in Generation ${generationIntroduced}. It is also known as the '${genus}'.`}
        </span>
        :
        <OneLineSkeleton />
      }
    </div>
  )
}

export default BasicIntro