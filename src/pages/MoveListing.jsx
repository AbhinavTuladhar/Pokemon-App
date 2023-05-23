import { React, useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { useQuery } from 'react-query'

const MoveListing = () => {
  // This fetches the URLs of all the moves
  const urlList = useMemo(() => {
    let urls = []
    for (let i = 1; i <= 100; i++) {
      urls.push(`https://pokeapi.co/api/v2/move/${i}/`)
    }
    return urls
  }, [])

  // For fetching data from a url.
  const fetchData = async (url) => {
    const response = await axios.get(url)
    return response.data
  }

  // Perform a GET request on all the 'calculated' URLs.
  const { data: moveData, isLoading } = useQuery(
    ['moveData'],
    () => Promise.all(urlList.map(fetchData)),
    { staleTime: Infinity, cacheTime: Infinity }
  )

  useEffect(() => {
    if (moveData) {
      console.log(moveData)
    }
  }, [moveData])

  if (!moveData) {
    return (
      <div> Loading... </div>
    )
  }

  return (
    <div>
      Move Listing
    </div>
  )
}

export default MoveListing