import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import BasicIntro from './BasicIntro'
import AdjacentLinks from './AdjacentLinks'
import PageNavigation from './PageNavigation'
import PokeDexEntry from './PokeDexEntry'
import ImageTile from './ImageTile'
import PokeDexData from './PokeDexData'
import TrainingInfo from './TrainingInfo'
import BaseStat from './BaseStat'
import SpriteTable from './SpriteTable'
import Locations from './Locations'
import BreedingInfo from './BreedingInfo'
import MovesLearned from './MovesLearned'
import TypeChart from './TypeChart'
import EvolutionChain from './EvolutionChain'
import PokemonVarieties from './PokemonVarieties'
import OtherLanguages from './OtherLanguages'
import { FadeInAnimationContainer } from '../../components/AnimatedContainers'
import { extractPokemonInformation, extractSpeciesInformation } from '../../utils/extractInfo'
import fetchData from '../../utils/fetchData'
import formatName from '../../utils/NameFormatting'

const PokemonDetail = () => {
  const { id } = useParams()

  const transformPokemonData = (data) => {
    return extractPokemonInformation(data)
  }

  const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${id}/`

  const { data: pokemonData, isLoading: isLoadingPokemonData } = useQuery({
    queryKey: ['pokemon-url', pokemonUrl],
    queryFn: () => fetchData(pokemonUrl),
    staleTime: Infinity,
    cacheTime: Infinity,
    select: transformPokemonData,
  })

  // Destructure the pokemonData object and assign them to several variables.
  const {
    abilities,
    base_experience,
    height,
    id: pokemonId,
    moves,
    name: pokemonName,
    nationalNumber,
    speciesLink,
    front_default: defaultSprite,
    front_shiny: shinySprite,
    spriteCollection,
    icon,
    stats,
    types,
    weight,
  } = pokemonData || {}

  // Setting the image source.
  const imageSourceNew = { defaultSprite, shinySprite, icon }
  const idInfo = { id: pokemonId, name: pokemonName }

  // Get the species data
  const transformSpeciesData = (data) => {
    return extractSpeciesInformation(data)
  }

  const { data: speciesData, isLoading: isLoadingSpeciesData } = useQuery({
    queryKey: ['speciesData', speciesLink],
    queryFn: () => fetchData(speciesLink),
    staleTime: Infinity,
    cacheTime: Infinity,
    select: transformSpeciesData,
  })

  const {
    base_happiness,
    capture_rate,
    egg_groups,
    evolutionChainUrl,
    flavor_text_entries,
    gender_rate,
    genera,
    genus,
    growth_rate,
    hatch_counter,
    names,
    pokedex_numbers,
    varieties,
  } = speciesData || {}

  // Setting the title
  document.title = pokemonName
    ? `${formatName(pokemonName)}: stats, moves, evolution and locations | Pokémon Database`
    : 'Loading...'

  // Define the props to all the child components.
  const BasicInfoProps = {
    id: pokemonId,
    name: pokemonName,
    types,
    genus,
    pokedex_numbers,
  }

  const PokeDexDataProps = {
    ...BasicInfoProps,
    abilities,
    height,
    nationalNumber,
    weight,
  }

  const TrainingInfoProps = {
    capture_rate,
    base_happiness,
    base_experience,
    growth_rate,
    stats,
  }

  const BreedingInfoProps = {
    egg_groups,
    gender_rate,
    hatch_counter,
  }

  const BaseStatProps = {
    stats,
  }

  const TypeChartProps = {
    types,
    name: pokemonName,
  }

  const PokeDexEntryProps = flavor_text_entries

  const SpriteTableProps = {
    pokemonName,
    spriteCollection,
  }

  const MovesLearnedProps = {
    moves,
    name: pokemonName,
  }

  const LocationsProps = {
    id: pokemonId,
    name: pokemonName,
  }

  const PokemonVarietiesProps = {
    pokemonName,
    varieties,
  }

  const OtherLanguagesProps = {
    names,
    genera,
  }

  if (isLoadingPokemonData || isLoadingSpeciesData) {
    return
  }

  return (
    <motion.div
      className="flex flex-col"
      exit={{ y: '100%', scale: 0.8, opacity: 0, transitionDuration: '0.75s' }}
    >
      <div className="flex justify-center text-4xl font-bold">
        <FadeInAnimationContainer>{formatName(idInfo.name)}</FadeInAnimationContainer>
      </div>

      <FadeInAnimationContainer className="my-4">
        <AdjacentLinks id={pokemonId} />
      </FadeInAnimationContainer>

      <FadeInAnimationContainer>
        <PageNavigation />
      </FadeInAnimationContainer>

      <FadeInAnimationContainer>
        <BasicIntro pokemonData={BasicInfoProps} />
      </FadeInAnimationContainer>

      <div className="grid grid-cols-pokemon-detail-grid gap-x-8 gap-y-6">
        <FadeInAnimationContainer className="col-span-2 md:col-span-1">
          <ImageTile imageSources={imageSourceNew} />
        </FadeInAnimationContainer>
        <FadeInAnimationContainer className="col-span-2 md:col-span-1">
          <PokeDexData pokemonData={PokeDexDataProps} />
        </FadeInAnimationContainer>
        <div className="col-span-2 flex w-full flex-col gap-y-6 mdlg:col-span-1">
          <FadeInAnimationContainer>
            <TrainingInfo data={TrainingInfoProps} />
          </FadeInAnimationContainer>
          <FadeInAnimationContainer>
            <BreedingInfo data={BreedingInfoProps} />
          </FadeInAnimationContainer>
        </div>
      </div>

      <div className="grid grid-cols-pokemon-detail-grid gap-x-8 gap-y-6">
        <FadeInAnimationContainer className="col-span-2">
          <BaseStat data={BaseStatProps} />
        </FadeInAnimationContainer>
        <FadeInAnimationContainer className="col-span-2 mdlg:col-span-1">
          <TypeChart data={TypeChartProps} />
        </FadeInAnimationContainer>
      </div>

      <section id="evolution-chain">
        <FadeInAnimationContainer>
          <EvolutionChain url={evolutionChainUrl} />
        </FadeInAnimationContainer>
      </section>

      <section id="pokedex-entries">
        <FadeInAnimationContainer>
          <PokeDexEntry data={PokeDexEntryProps} />
        </FadeInAnimationContainer>
      </section>

      <section className="gap-y-5 py-4" id="moves-learned">
        <FadeInAnimationContainer>
          <MovesLearned data={MovesLearnedProps} />
        </FadeInAnimationContainer>
      </section>

      <section id="sprite-table">
        <FadeInAnimationContainer>
          <SpriteTable data={SpriteTableProps} />
        </FadeInAnimationContainer>
      </section>

      <section id="locations">
        <FadeInAnimationContainer>
          <Locations props={LocationsProps} />
        </FadeInAnimationContainer>
      </section>

      <section id="languages">
        <FadeInAnimationContainer>
          <OtherLanguages data={OtherLanguagesProps} />
        </FadeInAnimationContainer>
      </section>

      <section id="varieties">
        <FadeInAnimationContainer>
          <PokemonVarieties data={PokemonVarietiesProps} />
        </FadeInAnimationContainer>
      </section>

      <FadeInAnimationContainer className="my-4">
        <AdjacentLinks id={pokemonId} />
      </FadeInAnimationContainer>
    </motion.div>
  )
}

export default PokemonDetail
