import React from 'react'
import SectionTitle from '../../components/SectionTitle'

const AbilityEffect = ({ entry }) => {
  const paragraphs = entry?.split('\n')
  return (
    <>
      <SectionTitle text={'Effect'} />
      { paragraphs?.map((paragraph, index) => (
        <> 
          { paragraph.charAt(0).toUpperCase() + paragraph.slice(1) }
          { index !== paragraphs?.length - 1 && <br /> }
        </>
      ))}
    </>
  )
}

export default AbilityEffect