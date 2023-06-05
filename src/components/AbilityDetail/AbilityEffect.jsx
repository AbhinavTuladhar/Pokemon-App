import React from 'react'
import SectionTitle from '../SectionTitle'

const AbilityEffect = ({ entry }) => {
  const paragraphs = entry?.split('\n')
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

export default AbilityEffect