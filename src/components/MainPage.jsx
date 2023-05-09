import { React, useEffect, useState, useMemo, useCallback } from 'react'
import axios from 'axios'
import PokeCard from './PokeCard'

const MainPage = ({ idRange }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Find the list of urls.
  const urlList = useMemo(() => {
    let urls = []
    for (let i = idRange[0]; i <= idRange[1]; i++) {
      urls.push(`https://pokeapi.co/api/v2/pokemon/${i}/`)
    }
    return urls
  }, [idRange])

  const fetchData = useCallback(async () => {
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
  }, [urlList])

  useEffect(() => {
    // setData([])
    setLoading(true)
    fetchData()
  }, [idRange, fetchData])

  const cachedData = useMemo(() => {
    if (data.length === 0) {
      return <div>Loading...</div>
    }
    const cardList = data.map(pokemon => {
      return <PokeCard data={pokemon} />
    })
    return cardList
  }, [data])
  

  const loadingText = (
    <div className='justify-center items-center text-5xl'> 
      Please wait, data is loading... 
    </div>)

  return (
    <div className='gap-x-2 gap-y-3 px-2 py-4 flex flex-wrap justify-center items-center '>
      {loading ? loadingText : cachedData}
    </div>  
  )
}

export default MainPage;