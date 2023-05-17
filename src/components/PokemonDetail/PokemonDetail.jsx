import { React, useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PokeDexEntry from './PokeDexEntry';
import ImageTile from './ImageTile';
import PokeDexData from './PokeDexData';
import TrainingInfo from './TrainingInfo';
import BaseStat from './BaseStat';
import Locations from './Locations';
import formatName from '../../utils/NameFormatting';

const PokemonDetail = () => {
  const { id } = useParams();
  const [idInfo, setIdInfo] = useState({})            // defines the ID number and name of the pokemon
  const [pokemon, setPokemon] = useState(null);       // the data that is obtained from the entry of the 'mon.
  const [imageSource, setImageSource] = useState('')  // for storing the normal and shiny sprites.
  const [speciesData, setSpeciesData] = useState({})  // defines the species information of the 'mon.
  const [speciesURL, setSpeciesURL] = useState('')
  const [dexEntry, setDexEntry] = useState({})

  const fetchData = useCallback(async () => {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}/`);
    const responseData = await response.data;
    setPokemon(responseData);
  }, [id])

  const fetchSpeciesData = useCallback(async () => {
    // const response = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
    const response = await axios.get(speciesURL)
    const responseData = await response.data
    setSpeciesData(responseData)
  }, [speciesURL])

  // For extracting information from the 'pokemon' object.
  const extractGeneralInformation = (data) => {
    const { 
      id,
      name,
      sprites: { other : { 'official-artwork' : { front_default, front_shiny }}} ,
      species: { url: speciesLink}
    } = data;
    setImageSource({defaultSprite: front_default, shinySprite: front_shiny})
    setSpeciesURL(speciesLink)
    setIdInfo(() => {
      const properName = formatName(name)
      return {
        id: id,
        name: properName
      }
    })
  };

  // same as above, but for speciesData.
  const extractSpeciesInformation = ( data ) => {
    if (!data || !data.genera)
      return
    const  { 
      genera, 
      flavor_text_entries, 
      base_happiness, 
      capture_rate, 
      growth_rate : {name: growthRateType},
      pokedex_numbers
    } = data
    // Find only the English genus name of the 'mon.
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

  // Fpr a dynamic title.
  useEffect(() => {
    const correctTitle = idInfo.name ? `${idInfo.name} Pokedex` : '...'
    document.title = correctTitle
  }, [idInfo])

  // Fetch the individual Pokemon and then the species data.
  useEffect(() => {
    fetchData();
    fetchSpeciesData();
  }, [fetchData, fetchSpeciesData]);

  // For extracting the information from the fetched 
  useEffect(() => {
    if (pokemon) {
      extractGeneralInformation(pokemon);
    }
    if (speciesData) {
      extractSpeciesInformation(speciesData)
    }
  }, [pokemon, speciesData]);

  // Render a simple loading page if both the dat hasn't been fetched.
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
      <div>
        <Locations id={idInfo.id} name={idInfo.name} />
      </div>
    </div>
  )
};

export default PokemonDetail;
