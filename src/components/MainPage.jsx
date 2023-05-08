import { React, useEffect, useState, useMemo } from 'react'
import axios from 'axios'
import NavBar from './NavBar'
import PokeCard from './PokeCard'

const MainPage = ({ idRange }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Find the list of urls.
  let urlList = []
  for (let i = idRange[0]; i <= idRange[1]; i++) {
    urlList.push(`https://pokeapi.co/api/v2/pokemon/${i}/`)
  }

  const fetchData = async () => {
    // const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=20')
    // const response = await axios.get('https://pokeapi.co/api/v2/pokemon/1/')
    try {
      const responses = await Promise.all(urlList.map(
        url => axios.get(url)
      ))
      const newData = responses.map(response => response.data)
      setData(newData)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setData([])
    setLoading(true)
    fetchData()
  }, [idRange])

  const cachedData = useMemo(() => {
    const cardList = data.map(pokemon => {
      return <PokeCard data={pokemon} />
    })
    return cardList
  }, [data])

  const loadingText = <div> Please wait, data is loading... </div>

  return (
    <div className='flex flex-wrap gap-x-2 gap-y-3 pt-4 text-white bg-gradient-to-br from-slate-600 to-slate-900 min-h-screen'>
      {loading ? loadingText : cachedData}
    </div>  
  )
}

export default MainPage;