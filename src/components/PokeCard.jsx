import { React, useEffect, useState} from 'react';
import axios from 'axios'

// const PokeCard = (props) => {
//   const [data, setData] = useState('')
//   const fetchData = async () => {
//     const response = await axios.get(url)
//     setData(response.data)
//     console.log(response.data)
//   }

//   useEffect(() => {
//     fetchData()
//   }, [])

//   return (
//     <pre>
//       {JSON.stringify(data, null, 2)}
//     </pre>
//   )
// }

const PokeCard = ({ data }) => {
  console.log(data)
  const {
    id,
    name,
    types,
    sprites: { other : { 'official-artwork' : { front_default }}}
  } = data

  return (
    <>
      <pre>
        {data.name}
      </pre>
      <img src={front_default} className='h-[100px]' />
    </>
  )
}

export default PokeCard;