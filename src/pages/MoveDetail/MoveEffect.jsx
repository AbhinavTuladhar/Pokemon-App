import React from 'react'
import Skeleton from 'react-loading-skeleton'
import SectionTitle from '../../components/SectionTitle'

const MoveEffect = ({ entry, chance }) => {
  const updatedEntry = entry?.replace('$effect_chance', chance)
  const paragraphs = updatedEntry?.split('\n')
  return (
    <>
      <SectionTitle text={'Effect'} />
      {paragraphs ? (
        paragraphs?.map((paragraph, index) => (
          <div key={index}>
            {/* Capitalse the first letter of each paragraph. */}
            {paragraph.charAt(0).toUpperCase() + paragraph.slice(1)}
            {index !== paragraphs?.length - 1 && <br />}
          </div>
        ))
      ) : (
        <Skeleton width="100%" height="8rem" containerClassName="flex-1 w-full" />
      )}
    </>
  )
}
export default MoveEffect
