import React from 'react'
import SectionTitle from '../../components/SectionTitle'
import Skeleton from 'react-loading-skeleton'

const AbilityEffect = ({ entry }) => {
  const paragraphs = entry?.split('\n')
  const paragraphDiv = paragraphs?.map((paragraph, index) => (
    <> 
      { paragraph.charAt(0).toUpperCase() + paragraph.slice(1) }
      { index !== paragraphs?.length - 1 && <br /> }
    </>
  ))
  return (
    <>
      <SectionTitle text={'Effect'} />
      {
        paragraphs
        ?
        paragraphDiv
        :
        <Skeleton width='100%' height='8rem' containerClassName='flex-1 w-full' />
      }
    </>
  )
}

export default AbilityEffect