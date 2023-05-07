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
  const {
    id,
    name,
    types,
    sprites: { other : { 'official-artwork' : { front_default }}}
  } = data

  const properName = name.charAt(0).toUpperCase() + name.slice(1);
  
  const image = <img src={front_default} className='h-[100px]' />

  let typeList = types.map(type => {
    return type.type.name
  })

  typeList = typeList.join(', ')

  return (
    <div className='border border-slate-200 flex flex-col justify-center items-center md:w-2/12 sm:w-1/3 mx-auto'>
      <div className='font-bold'>
        #{id}
      </div>
      <div className='font-extrabold text-xl'>
        {properName}
      </div>
      <div>
        {image}
      </div>
      <div>
        {typeList}
      </div>
    </div>
  )
}

export default PokeCard;