import { React, useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Abilities from './Abilities';
import PokeDexEntry from './PokeDexEntry';
import ImageTile from './ImageTile';
import PokeDexData from './PokeDexData';

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
    setImageSource({defaultSprite: front_default, shinySprite: front_shiny})
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
    console.log(pokemon)
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
    <div className='flex flex-col justify-center'>
      <div className="text-4xl font-bold flex justify-center">
        {idInfo.name}
      </div>
      {/* <div className='text-xl flex justify-center my-4'>
        {speciesData.genus}
      </div> */}
      <div className='flex flex-row flex-wrap gap-x-10 my-10 mx-10'>
        <div className='flex-grow w-1/4'>
          <ImageTile imageSources={imageSource} />
        </div>
        <div className='flex-grow w-1/4'>
          <PokeDexData pokemonData={{...pokemon, ...speciesData}} />
        </div>
        <div className='flex-grow w-1/4'>
          <PokeDexData pokemonData={{...pokemon, ...speciesData}} />
        </div>
      </div>
    </div>
  )

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
          <ImageTile />
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail;
