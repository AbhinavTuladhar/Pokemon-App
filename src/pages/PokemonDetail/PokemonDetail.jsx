import { React, useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from 'react-query';
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
import TypeChart from './TypeChart';
import { extractPokemonInformation, extractSpeciesInformation, extractPokemonInformationNew } from '../../utils/extractInfo'
import fetchData from '../../utils/fetchData';

const PokemonDetail = () => {
  const { id } = useParams();
  const [idInfo, setIdInfo] = useState({})            // defines the ID number and name of the pokemon
  const [pokemon, setPokemon] = useState(null);       // the data that is obtained from the entry of the 'mon.
  const [imageSource, setImageSource] = useState('')  // for storing the normal and shiny sprites.
  const [speciesData, setSpeciesData] = useState({})  // defines the species information of the 'mon.
  const [speciesURL, setSpeciesURL] = useState('')
  const [dexEntry, setDexEntry] = useState({})

  const fetchDataOld = useCallback(async () => {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}/`);
    const responseData = await response.data;
    setPokemon(responseData);
  }, [id])

  const fetchSpeciesData = useCallback(async () => {
    const response = await axios.get(speciesURL)
    const responseData = await response.data
    setSpeciesData(responseData)
  }, [speciesURL])

  const transformPokemonData = data => {
    return extractPokemonInformationNew(data)
  }

  const { data: pokemonData, isLoading: isLoadingPokemonData } = useQuery(
    ['pokemonData', id],
    () => fetchData(`https://pokeapi.co/api/v2/pokemon/${id}/`),
    { staleTime: Infinity, cacheTime: Infinity, select: transformPokemonData }
  ) 

  // Destructure the pokemoNData object and assign them to several variables.
  const {
    abilities,
    base_experience,
    forms,
    game_indices,
    height,
    id: pokemonId,
    moves,
    name: pokemonName,
    speciesLink,
    front_default: defaultSprite,
    front_shiny: shinySprite,
    gameSprite,
    icon,
    stats,
    types,
    weight
  } = pokemonData || {}

  // Setting the image source.
  const imageSourceNew = { defaultSprite, shinySprite, icon }
  const idInfoNew = { pokemonId, pokemonName }

  // Get the species data
  const transformSpeciesData = data => {
    return extractSpeciesInformation(data)
  }

  const { data: speciesDataNew } = useQuery(
    ['speciesData', speciesLink],
    () => fetchData(speciesLink),
    { staleTime: Infinity, cacheTime: Infinity, select: transformSpeciesData }
  )

  const { 
    base_happiness,
    capture_rate,
    egg_groups,
    evolutionChainUrl,
    flavor_text_entries,
    gender_rate,
    generationIntroduced,
    genus,
    growth_rate,
    hatch_counter,
    pokedex_numbers,
  } = speciesDataNew || {}

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
    fetchDataOld();
    fetchSpeciesData();
  }, [fetchDataOld, fetchSpeciesData]);

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

  // Define the props to all the child components.
  const BasicInfoProps = {
    id: pokemonId,
    name: pokemonName,
    types,
    genus,
    pokedex_numbers
  }

  const PokeDexDataProps = {
    ...BasicInfoProps,
    abilities,
    height,
    weight
  }

  const TrainingInfoProps = {
    capture_rate,
    base_happiness,
    base_experience,
    growth_rate,
    stats
  }

  const BreedingInfoProps = {
    egg_groups,
    gender_rate,
    hatch_counter
  }

  const BaseStatProps = {
    stats
  }

  const TypeChartProps = {
    types,
    name: pokemonName
  }

  const PokeDexEntryProps = flavor_text_entries

  const MovesLearnedProps = {
    moves,
    name: pokemonName,
  }

  const LocationsProps = {
    id: pokemonId,
    name: pokemonName
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

      <BasicIntro pokemonData={ BasicInfoProps } />

      <div className='flex flex-row flex-wrap gap-x-5'>

        <div className='flex-grow w-full mdlg:w-1/4 md:w-1/3 py-4'>
          <ImageTile imageSources={ imageSourceNew } />
        </div>

        <div className='flex-grow w-full mdlg:w-1/4 md:w-1/3 py-4'>
          <PokeDexData pokemonData={ PokeDexDataProps } />
        </div>

        <div className='flex flex-col flex-grow w-full mdlg:w-1/4 md:w-1/3 py-4 gap-y-5'>
          <div className='flex flex-col w-full'>
            <TrainingInfo data={ TrainingInfoProps } />
          </div>
          <div className='flex flex-col w-full'>
            <BreedingInfo data={ BreedingInfoProps } />
          </div>
        </div>
        
        <section className='flex flex-row flex-grow flex-wrap gap-x-5'>
          <div className='flex flex-col flex-grow w-full mdlg:w-[44%] sm:w-full'>
            <BaseStat data={ BaseStatProps } />
          </div>
          <div className='flex flex-col flex-grow w-full mdlg:w-[10%] sm:w-full'>
            <TypeChart data={ TypeChartProps } />
          </div> 
        </section>
      </div>

      <section>
        <PokeDexEntry data={ PokeDexEntryProps } />
      </section>

      <section className='py-4 gap-y-5'>
        <MovesLearned data={ MovesLearnedProps } />
      </section>
      
      <section>
        <Locations props={ LocationsProps } />
      </section>
    </motion.div>
  )
};

export default PokemonDetail;
