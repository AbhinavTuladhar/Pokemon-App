import axios from 'axios'

const fetchData = async (url, signal) => {
  const response = await axios.get(url, {
    signal,
  })
  return response.data
}

export default fetchData
