import React from 'react'
import { useParams } from 'react-router-dom'

const MoveDetail = () => {
  const { id } = useParams()

  return (
    <div>
      The move id is { id }.
    </div>
  )
}

export default MoveDetail