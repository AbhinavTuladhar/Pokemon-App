import React from 'react'
import TypeCard from '../../components/TypeCard'
import formatName from '../../utils/NameFormatting'
import generationMappingV2 from '../../utils/generationMappingV2'
import OneLineSkeleton from '../../components/OneLineSkeleton'

const BasicIntro = ({ pokemonData }) => {
  const { id, name, types, genus } = pokemonData

  // Don't display for the other Pokemon forms.
  if (id >= 10_000) return

  // For grammatical purposes.
  const firstType = types[0].type.name
  const article = firstType.startsWith('e') || firstType.startsWith('i')
    ? 'an' : 'a'

  // Use the national number instead of the ID numbers to take into account the forms.
  // const generationIntroduced = generationMappingV2(pokedex_numbers?.slice(0, 1).entry_number)
  const generationIntroduced = generationMappingV2(id)
  // Use only the first word for the other forms.
  const properName = formatName(name).split(' ')[0]

  const typeDiv = types.map((type, index) => {
    const typeName = type.type.name
    return (
      <span key={index}>
        <TypeCard typeName={typeName} useTextOnly={true} />
        {index !== types.length - 1 && <span> / </span>}
      </span>
    )
  })


  return (
    <div className='flex flex-row flex-wrap mt-8 mb-2'>
      {genus ? (
        <span>
          {`${properName} is ${article}`} &nbsp;
          {typeDiv} &nbsp;
          {`type Pokemon introduced in Generation ${generationIntroduced}. It is also known as the '${genus}'.`}
        </span>
      ) :
        <OneLineSkeleton />
      }
    </div>
  )
}

export default BasicIntro