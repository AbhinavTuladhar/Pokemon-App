import React from 'react'
import SectionTitle from '../SectionTitle'

const MoveEffect = ({ entry, chance }) => {
  const updatedEntry = entry?.replace('$effect_chance', chance);
  const paragraphs = updatedEntry?.split('\n')
  return (
    <>
      <SectionTitle text={'Effect'} />
      { paragraphs?.map((paragraph, index) => (
        <> 
          { paragraph }
          { index !== paragraphs?.length - 1 && <br /> }
        </>
      ))}
    </>
  )
}
export default MoveEffect