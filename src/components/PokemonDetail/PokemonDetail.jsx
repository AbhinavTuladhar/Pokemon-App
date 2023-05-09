import { React, useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Abilities from './Abilities';
import PokeDexEntry from './PokeDexEntry';

const PokemonDetail = () => {
  const { id } = useParams();
  const [idInfo, setIdInfo] = useState({})
  const [pokemon, setPokemon] = useState(null);
  const [abilityData, setAbilityData] = useState([]);
  const [imageSource, setImageSource] = useState('')
  const [speciesData, setSpeciesData] = useState({})
  const [dexEntry, setDexEntry] = useState({})

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
      sprites: { other : { 'official-artwork' : { front_default, front_shiny }}} 
    } = data;
    setAbilityData(abilities);
    setImageSource({default: front_default, shiny: front_shiny})
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
    const  { genera, flavor_text_entries } = data
    const englishData = genera.find(entry => entry.language.name === 'en')
    setDexEntry(flavor_text_entries)
    setSpeciesData((prevState) => {
      return {
        genus: englishData.genus
      }
    })
  }

  useEffect(() => {
    fetchData();
    fetchSpeciesData();
  }, [fetchData, fetchSpeciesData]);

  useEffect(() => {
    if (pokemon) {
      extractGeneralInformation(pokemon);
    }
    if (speciesData)
    extractSpeciesInformation(speciesData)
    console.log(speciesData)
  }, [pokemon, speciesData]);

  if (!pokemon || !speciesData) {
    return (
      <>
        Loading...
      </>
    );
  }

  return (
    <div className='gap-x-2 gap-y-3 pt-4 text-white bg-gradient-to-br from-slate-600 to-slate-900 min-h-screen'>
      <div className="text-4xl font-bold flex justify-center">
        #{idInfo.id}: {idInfo.name}
      </div>
      <div className='text-xl flex justify-center my-4'>
        {speciesData.genus}
      </div>
      <div className='grid grid-cols-4 auto-rows-auto'>
        <div className='col-start-1 col-end-4 my-4 h-auto'>
          <PokeDexEntry data={dexEntry} />
        </div>
        <div className='col-start-1 col-end-4'>
          <Abilities data={abilityData} />
        </div>
        <div className='h-auto col-start-4 row-start-1 row-end-3'>
          <div className='flex flex-col'>
            <img src={imageSource.default} alt={idInfo} />
            <p className='text-center'> Normal version </p>
            <img src={imageSource.shiny} alt={idInfo} />
            <p className='text-center'> Shiny version </p>
          </div>
        </div>
      </div>
      {/* <img src={imageSource} />
      <Abilities data={abilityData} /> */}
    </div>
  );
};

export default PokemonDetail;
