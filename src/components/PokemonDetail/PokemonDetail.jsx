import { React, useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Abilities from './Abilities';
import PokeDexEntry from './PokeDexEntry';
import ImageTile from './ImageTile';
import PokeDexData from './PokeDexData';
import TrainingInfo from './TrainingInfo';
import BaseStat from './BaseStat';

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
    // console.log(data)
    const  { 
      genera, 
      flavor_text_entries, 
      base_happiness, 
      capture_rate, 
      growth_rate : {name: growthRateType},
      pokedex_numbers
    } = data
    const englishGenus = genera.find(entry => entry.language.name === 'en')
    setDexEntry(flavor_text_entries)
    setSpeciesData(() => {
      return {
        genus: englishGenus.genus,
        base_happiness: base_happiness,
        capture_rate: capture_rate,
        growth_rate: growthRateType,
        pokedex_numbers: pokedex_numbers
      }
    })
  }

  useEffect(() => {
    const correctTitle = idInfo.name ? `${idInfo.name} Pokedex` : '...'
    document.title = correctTitle
  }, [idInfo])

  useEffect(() => {
    fetchData();
    fetchSpeciesData();
  }, [fetchData, fetchSpeciesData]);

  useEffect(() => {
    if (pokemon) {
      extractGeneralInformation(pokemon);
    }
    console.log(pokemon)
    if (speciesData) {
      extractSpeciesInformation(speciesData)
      // console.log(speciesData)
    }
  }, [pokemon, speciesData]);

  if (!pokemon || !speciesData) {
    return (
      <>
        Loading...
      </>
    );
  }

  return (
    <div className='flex flex-col justify-center gap-y-10 mx-10'>
      <div className="text-4xl font-bold flex justify-center">
        {idInfo.name}
      </div>
      <div className='flex flex-row flex-wrap gap-x-10'>
        <div className='flex-grow w-full md:w-1/4 sm:w-full py-4'>
          <ImageTile imageSources={imageSource} />
        </div>
        <div className='flex-grow w-full md:w-1/4 sm:w-full py-4'>
          <PokeDexData pokemonData={{...pokemon, ...speciesData}} />
        </div>
        <div className='flex-grow w-full md:w-1/4 sm:w-full py-4'>
          <TrainingInfo data={{...pokemon, ...speciesData}} />
        </div>
        <div className='w-full md:w-2/3 sm:w-full py-4'>
          <BaseStat data={{...pokemon, ...speciesData}} />
        </div>
      </div>
      <div>
        <PokeDexEntry data={dexEntry} />
      </div>
    </div>
  )
};

export default PokemonDetail;
