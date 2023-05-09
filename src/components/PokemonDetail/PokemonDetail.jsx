import { React, useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Abilities from './Abilities';

const PokemonDetail = () => {
  const { id } = useParams();
  const [idInfo, setIdInfo] = useState({})
  const [pokemon, setPokemon] = useState(null);
  const [abilityData, setAbilityData] = useState([]);
  const [imageSource, setImageSource] = useState('')
  const [speciesData, setSpeciesData] = useState({})

  const fetchData = useCallback(async () => {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}/`);
    const responseData = await response.data;
    setPokemon(responseData);
  }, [id])

  const fetchSpeciesData = useCallback(async () => {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
    const responseData = await response.data
    setSpeciesData(responseData)
  }, [id])

  const extractGeneralInformation = (data) => {
    const { 
      id,
      name,
      abilities, 
      sprites: { other : { 'official-artwork' : { front_default }}} 
    } = data;
    setAbilityData(abilities);
    setImageSource(front_default)
    setIdInfo(() => {
      const properName = name.charAt(0).toUpperCase() + name.slice(1);
      return {
        id: id,
        name: properName
      }
    })
  };

  const extractSpeciesInformation = ( data ) => {
    if (!data || !data.genera)
      return
    console.log(data)
    const  { genera } = data
    const englishData = genera.find(entry => entry.language.name === 'en')
    setSpeciesData((prevState) => {
      return {
        genus: englishData.genus
      }
    })
  }

  useEffect(() => {
    fetchData();
    fetchSpeciesData();
  }, [id, fetchData, fetchSpeciesData]);

  useEffect(() => {
    if (pokemon) {
      extractGeneralInformation(pokemon);
    }
    if (speciesData)
    extractSpeciesInformation(speciesData)
    console.log(speciesData)
  }, [pokemon, speciesData]);

  if (!pokemon && !speciesData) {
    return (
      <div className='text-white bg-gradient-to-br from-slate-600 to-slate-900 min-h-screen'>
        Loading...
      </div>
    );
  }

  return (
    <div className='gap-x-2 gap-y-3 pt-4 text-white bg-gradient-to-br from-slate-600 to-slate-900 min-h-screen'>
      <div className="text-4xl font-bold flex justify-center">
        #{idInfo.id}: {idInfo.name}
      </div>
      <div className='text-xl flex justify-center my-4'>
        {
          speciesData && 
          speciesData.genus
        }
      </div>
      <div className='grid grid-cols-4'>
        <div className='col-start-1 col-end-4'>
          <Abilities data={abilityData} />
        </div>
        <div className='h-[500px] col-start-4'>
          <img src={imageSource} alt={idInfo} />
        </div>
      </div>
      {/* <img src={imageSource} />
      <Abilities data={abilityData} /> */}
    </div>
  );
};

export default PokemonDetail;
