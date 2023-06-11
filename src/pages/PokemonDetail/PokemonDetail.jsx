import { React, useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion'
import BasicIntro from './BasicIntro';
import PokeDexEntry from './PokeDexEntry';
import ImageTile from './ImageTile'
import PokeDexData from './PokeDexData'
import TrainingInfo from './TrainingInfo'
import BaseStat from './BaseStat'
import Locations from './Locations'
import BreedingInfo from './BreedingInfo'
import MovesLearned from './MovesLearned'
import { extractPokemonInformation, extractSpeciesInformation } from '../../utils/extractInfo'

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
    const response = await axios.get(speciesURL)
    const responseData = await response.data
    setSpeciesData(responseData)
  }, [speciesURL])

  // For extracting information from the 'pokemon' object.
  const setGeneralInformation = (data) => {
    const extractedInfo = extractPokemonInformation(data)
    const { 
      id,
      name,
      defaultSprite,
      shinySprite,
      speciesUrl,
      icon
    } = extractedInfo;
    setImageSource({defaultSprite, shinySprite, icon})
    setSpeciesURL(speciesUrl)
    setIdInfo(() => ({ id, name }))
  };

  // same as above, but for speciesData.
  const setSpeciesInformation = ( data ) => {
    if (!data || !data.genera)
      return
    const extractedInfo = extractSpeciesInformation(data)
    const { flavor_text_entries } = extractedInfo
    setDexEntry(flavor_text_entries)
    setSpeciesData(extractedInfo)
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
      setGeneralInformation(pokemon);
    }
    if (speciesData) {
      setSpeciesInformation(speciesData)
    }
  }, [pokemon, speciesData]);

  // Render a simple loading page if both the dat hasn't been fetched.
  if (!pokemon || !speciesData) {
    return
  }

  return (
    <motion.div 
      className='gap-y-5 md:mx-10 mx-4'
      initial={{ y: '100%', scale: 0.8, opacity: 0 }}
      animate={{ y: 0, scale: 1, opacity: 1, transitionDuration: '0.8s' }}
      exit={{ y: '100%', scale: 0.8, opacity: 0, transitionDuration: '0.75s' }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <div className="text-4xl font-bold flex justify-center">
        {idInfo.name}
      </div>

      <BasicIntro pokemonData={{...pokemon, ...speciesData}} />

      <div className='flex flex-row flex-wrap gap-x-10'>
        <div className='flex-grow w-full mdlg:w-1/4 md:w-1/3 sm:w-full py-4'>
          <ImageTile imageSources={imageSource} />
        </div>
        <div className='flex-grow w-full mdlg:w-1/4 md:w-1/3 sm:w-full py-4'>
          <PokeDexData pokemonData={{...pokemon, ...speciesData}} />
        </div>
        <div className='flex flex-col flex-grow w-full mdlg:w-1/4 md:w-1/3 sm:w-full py-4 gap-y-5'>
          <div className='flex flex-col w-full'>
            <TrainingInfo data={{...pokemon, ...speciesData}} />
          </div>
          <div className='flex flex-col w-full'>
            <BreedingInfo data={{...pokemon, ...speciesData}} />
          </div>
        </div>
        <div className='w-full md:w-full sm:w-full'>
          <BaseStat data={{...pokemon, ...speciesData}} />
        </div>
      </div>

      <div>
        <PokeDexEntry data={dexEntry} />
      </div>

      <div className='py-4 gap-y-5'>
        <MovesLearned data={{ ...pokemon }} id={idInfo.id} name={idInfo.name} />
      </div>
      
      <div>
        <Locations id={idInfo.id} name={idInfo.name} />
      </div>
    </motion.div>
  )
};

export default PokemonDetail;
