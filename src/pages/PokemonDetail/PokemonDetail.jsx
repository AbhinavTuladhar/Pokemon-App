import React from 'react';
import { useParams } from 'react-router-dom';
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
import EvolutionChain from './EvolutionChain';
import { extractPokemonInformation, extractSpeciesInformation } from '../../utils/extractInfo'
import fetchData from '../../utils/fetchData';
import formatName from '../../utils/NameFormatting';

const PokemonDetail = () => {
  const { id } = useParams();

  const transformPokemonData = data => {
    return extractPokemonInformation(data)
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
    nationalNumber,
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
  const idInfo = { id: pokemonId, name: pokemonName }

  // Get the species data
  const transformSpeciesData = data => {
    return extractSpeciesInformation(data)
  }

  const { data: speciesDataNew, isLoading: isLoadingSpeciesData } = useQuery(
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

  // Setting the title
  document.title = `${formatName(pokemonName)}: stats, moves, evolution and locations | Pokémon Database`

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
    nationalNumber,
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

  if (isLoadingPokemonData || isLoadingSpeciesData) {
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
        {formatName(idInfo.name)}
      </div>

      <BasicIntro pokemonData={ BasicInfoProps } />

      <div className='flex flex-row flex-wrap gap-x-10'>

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
        
        <section className='flex flex-row flex-grow flex-wrap justify-between gap-x-9'>
          <div className='flex flex-col flex-grow w-full mdlg:w-[51%] sm:w-full'>
            <BaseStat data={ BaseStatProps } />
          </div>
          <div className='flex flex-col flex-grow w-full mdlg:w-[16.5%] sm:w-full'>
            <TypeChart data={ TypeChartProps } />
          </div> 
        </section>
      </div>

      <section>
        <EvolutionChain url={ evolutionChainUrl } />
      </section>

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
