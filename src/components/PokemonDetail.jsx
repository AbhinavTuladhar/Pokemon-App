// import { React, useEffect, useState} from 'react'
// import { useParams } from 'react-router-dom'
// import axios from 'axios'

// const PokemonDetail = () => {
//   const { id } = useParams()
//   const [data, setData] = useState([])
//   const [loading, setLoading] = useState(true)
//   let detailInformation = ''

//   const fetchData = async () => {
//     const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}/`)
//     const responseData = await response.data
//     setData(responseData)
//     setLoading(false)
//   }

//   useEffect(() => {
//     setLoading(true)
//     fetchData()
//   }, [])

//   useEffect(() => {
//     console.log(data)
//   }, [data])

//   useEffect(() => {
//     const { 
//       abilities,
//       id: idNumber,
//       name
//     } = data;  
//     const properName = name.charAt(0).toUpperCase() + name.slice(1);
  
//     abilities.forEach(ability => {
//       console.log(ability.ability.name)
//     })

//     detailInformation = (
//       <div className='text-4xl font-bold flex justify-center items-center'>
//         #{idNumber}: {properName}
//       </div>
//     )
//   }, [data])

//   const loadingText = <h1> Loading... </h1>


//   return (
//     <>
//       {loading ? loadingText : detailInformation}
//     </>
//   )
// }

// export default PokemonDetail;

import { React, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PokemonDetail = () => {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}/`);
    const responseData = await response.data;
    setPokemon(responseData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const loadingScreen = (
    <div className='text-white bg-gradient-to-br from-slate-600 to-slate-900 min-h-screen'>
      Loading...
    </div>
  )
  
  if (!pokemon) {
    return loadingScreen
  }
  
  const { abilities, id: idNumber, name } = pokemon;
  const properName = name.charAt(0).toUpperCase() + name.slice(1);

  const detailedInformation = (
    <div className="text-4xl font-bold flex justify-center items-center">
      #{idNumber}: {properName}
    </div>
  );

  abilities.forEach((ability) => {
    console.log(ability.ability.name);
  });

  return (
    <div className='gap-x-2 gap-y-3 pt-4 text-white bg-gradient-to-br from-slate-600 to-slate-900 min-h-screen'>
      {/* {loading && !pokemon ? loadingScreen : detailedInformation} */}
      <div className="text-4xl font-bold flex justify-center">
        #{idNumber}: {properName}
      </div>
    </div>)
};

export default PokemonDetail;


