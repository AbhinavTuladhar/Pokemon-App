import { React, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query'
import axios from 'axios';
import PokeDexEntry from './PokeDexEntry';
import ImageTile from './ImageTile';
import PokeDexData from './PokeDexData';
import TrainingInfo from './TrainingInfo';
import BaseStat from './BaseStat';
import Locations from './Locations';

const PokemonDetail = () => {
  const { id } = useParams();
  const [idInfo, setIdInfo] = useState({})                    // defines the ID number and name of the pokemon
  const [pokemonData, setPokemonData] = useState(null);       // the data that is obtained from the entry of the 'mon.
  const [imageSource, setImageSource] = useState('')          // for storing the normal and shiny sprites.
  const [speciesData, setSpeciesData] = useState({})          // defines the species information of the 'mon.
  const [dexEntry, setDexEntry] = useState({})

  const fetchData = async () => {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}/`);
    const responseData = await response.data;
    return responseData
  }

  const fetchSpeciesData = async () => {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
    const responseData = await response.data
    return responseData
  }

  // For extracting information from the 'pokemon' object.
  const extractGeneralInformation = (data) => {
    const { 
      id,
      name,
      sprites: { other : { 'official-artwork' : { front_default, front_shiny }}} 
    } = data;
    setImageSource({defaultSprite: front_default, shinySprite: front_shiny})
    setIdInfo(() => {
      const properName = name.charAt(0).toUpperCase() + name.slice(1);
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

  // Fetch the pokemon data using react query
  const { data: pokemon } = useQuery('individual pokemon data', fetchData)
  const { data: species } = useQuery('species data', fetchSpeciesData)

  // Now set the fetched data to the respective state variables
  useEffect(() => {
    if (pokemon)
      setPokemonData(pokemon)
  }, [pokemon])

  useEffect(() => {
    if (species)
      setSpeciesData(species)
  }, [species])

  // For extracting the information from the fetched 
  useEffect(() => {
    if (pokemonData) {
      extractGeneralInformation(pokemonData);
    }
    if (speciesData) {
      extractSpeciesInformation(speciesData)
    }
  }, [pokemonData, speciesData]);

  // Render a simple loading page if both the dat hasn't been fetched.
  if (!pokemonData || !speciesData) {
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
          <PokeDexData pokemonData={{...pokemonData, ...speciesData}} />
        </div>
        <div className='flex-grow w-full md:w-1/4 sm:w-full py-4'>
          <TrainingInfo data={{...pokemonData, ...speciesData}} />
        </div>
        <div className='w-full md:w-2/3 sm:w-full py-4'>
          <BaseStat data={{...pokemonData, ...speciesData}} />
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
