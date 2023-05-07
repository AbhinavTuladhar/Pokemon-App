import { React, useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const PokemonDetail = () => {
  const { id } = useParams()
  const [data, setData] = useState([])

  const fetchData = async () => {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}/`)
    const responseData = await response.data
    setData(responseData)
  }

  useEffect(() => {
    fetchData()
  })

  return (<pre> {JSON.stringify(data, null, 2)} </pre>)
}

export default PokemonDetail;