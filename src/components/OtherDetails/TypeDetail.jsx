import React from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

const TypeDetail = ( ) => {
  const { type } = useParams()

  return (<> {type} </>)
}

export default TypeDetail;