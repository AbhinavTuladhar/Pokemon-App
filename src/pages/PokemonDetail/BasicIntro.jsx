import React from 'react'
import formatName from '../../utils/NameFormatting'
import TypeCard from '../../components/TypeCard'

const BasicIntro = ({ pokemonData }) => {
  const { name, types, genus } = pokemonData
  
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
      <span>
        {`${formatName(name)} is a`} &nbsp;
        {typeDiv} &nbsp;
        {`type Pokemon introduced in generation X. It is also known as the '${genus}'.`}
      </span>
    </div>
  )
}

export default BasicIntro