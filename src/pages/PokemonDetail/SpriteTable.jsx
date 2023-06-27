import React from 'react'
import SectionTitle from '../../components/SectionTitle'
import formatName from '../../utils/NameFormatting'

const SpriteTable = ({ data }) => {
  const { pokemonName, spriteCollection } = data

  // Get only those objects which don't have two null values for the sprite Url
  const properSpriteCollection = spriteCollection.filter(obj => {
    const nullUndefinedCount = Object.values(obj).filter(value => value === null || value === undefined).length;
    return nullUndefinedCount <= 1;
  });

  console.log(properSpriteCollection)

  return (
    <>
      <SectionTitle text={`${formatName(pokemonName)} sprites`} />
    </>
  )
}

export default SpriteTable