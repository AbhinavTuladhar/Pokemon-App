import React from 'react'
import SectionTitle from '../../components/SectionTitle';

const MoveEffect = ({ entry, chance }) => {
  const updatedEntry = entry?.replace('$effect_chance', chance);
  const paragraphs = updatedEntry?.split('\n')
  return (
    <>
      <SectionTitle text={'Effect'} />
      {paragraphs?.map((paragraph, index) => (
        <div key={index}>
          {/* Capitalse the first letter of each paragraph. */}
          {paragraph.charAt(0).toUpperCase() + paragraph.slice(1)}
          {index !== paragraphs?.length - 1 && <br />}
        </div>
      ))}
    </>
  )
}
export default MoveEffect