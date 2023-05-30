import React from 'react'
import SectionTitle from '../SectionTitle'

const MoveEffect = ({ entry, chance }) => {
  const updatedEntry = entry?.replace('$effect_chance', chance);
  return (
    <div>
      <SectionTitle text={'Effects'} />
      { updatedEntry }
    </div>
  )
}
export default MoveEffect