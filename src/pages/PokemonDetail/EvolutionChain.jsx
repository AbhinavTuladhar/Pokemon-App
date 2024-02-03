import React from 'react'
import { useQueries, useQuery } from '@tanstack/react-query'
import { NavLink } from 'react-router-dom'
import { BsArrowRight, BsArrowDown, BsArrowUpRight, BsArrowDownRight } from 'react-icons/bs'
import Skeleton from 'react-loading-skeleton'
import TypeCard from '../../components/TypeCard'
import SectionTitle from '../../components/SectionTitle'
import fetchData from '../../utils/fetchData'
import { extractPokemonInformation } from '../../utils/extractInfo'
import formatName from '../../utils/NameFormatting'
import evolutionStringFinder from '../../utils/evolutionStringFinder'
import '../../index.css'

const PokemonCard = ({ pokemonData, splitEvoFlag }) => {
  const { homeSprite, name, id, types } = pokemonData
  const typeDiv = types.map((type, index) => {
    const typeName = type.type.name
    return (
      <span key={index}>
        <TypeCard typeName={typeName} useTextOnly={true} />
        {index !== types.length - 1 && <span> · </span>}
      </span>
    )
  })

  // For the identifying number
  const formattedId = `#${('00' + id).slice(-3)}`

  return (
    <div
      className={`flex ${splitEvoFlag ? 'flex-col' : 'flex-row sm:flex-row md:flex-col'} mx-auto w-fit items-center justify-center gap-y-2`}
    >
      <img src={homeSprite} alt={name} className="aspect-square h-32" />
      <div className="flex w-full flex-col items-center justify-center">
        {formattedId}
        <NavLink to={`/pokemon/${name}`} className="hoverable-link font-bold">
          {formatName(name)}
        </NavLink>
        <span className="text-center">{typeDiv}</span>
      </div>
    </div>
  )
}

const EvolutionDiv = ({ individualPokemon, finalPokemonData }) => {
  const firstPokemonName = (finalPokemonData ?? [])[0]?.name || ''
  const wurmpleFlag = firstPokemonName === 'wurmple'

  return individualPokemon?.map((pokemon, index) => {
    const currentPokemonData = finalPokemonData[index]
    const pokemonData = finalPokemonData[(index + 1) % individualPokemon.length]
    const nextnextData = finalPokemonData[(index + 2) % individualPokemon.length]

    const nextPokemon = wurmpleFlag
      ? individualPokemon[index + 1]
      : individualPokemon[(index + 1) % individualPokemon.length]
    const nextNextPokemon = wurmpleFlag
      ? individualPokemon[(index + 2) % individualPokemon.length]
      : individualPokemon[(index + 2) % individualPokemon.length]

    const { evolutionDetails } = pokemonData
    const { evolutionDetails: nextnextEvoDetail } = nextnextData

    const evolutionExtractedInfo = evolutionStringFinder(evolutionDetails)
    const evolutionExtractedInfoNext = evolutionStringFinder(nextnextEvoDetail)

    // This is for a three-way evolution
    const finalPokemon = wurmpleFlag ? undefined : individualPokemon[index + 3]
    const lastPokemonData = finalPokemonData[index + 3]
    const { evolutionDetails: finalEvoDetail } = lastPokemonData || {}
    const evolutionExtractedInfoFinal = evolutionStringFinder(finalEvoDetail)

    // For split evolutions
    /*
    Note: the middle arrow is only for a three-way evoltuion.
    */
    if (currentPokemonData.nextEvoSplit) {
      return (
        <div className="flex flex-col md:flex-row" key={index}>
          {pokemon}
          <div className="flex flex-row justify-between gap-y-10 md:flex-col">
            <div className="flex flex-col items-center justify-center text-center md:flex-row">
              <div className="mx-4 flex w-full flex-col items-center justify-center md:w-48">
                <BsArrowUpRight size={60} className="hidden md:flex" />
                <BsArrowDown size={60} className="mx-4 flex md:hidden" />
                <span> {`(${evolutionExtractedInfo})`} </span>
              </div>
              {nextPokemon}
            </div>
            <div className="flex flex-col items-center justify-center text-center md:flex-row">
              <div className="mx-4 flex w-full flex-col items-center justify-center md:w-48">
                {finalPokemon ? (
                  <BsArrowRight size={60} className="hidden md:flex" />
                ) : (
                  <BsArrowDownRight size={60} className="hidden md:flex" />
                )}
                <BsArrowDown size={60} className="mx-4 flex md:hidden" />
                <span> {`(${evolutionExtractedInfoNext})`} </span>
              </div>
              {nextNextPokemon}
            </div>
            {finalPokemon && (
              <div className="flex flex-col items-center justify-center text-center md:flex-row">
                <div className="mx-4 flex w-full flex-col items-center justify-center md:w-48">
                  <BsArrowDownRight size={60} className="hidden md:flex" />
                  <BsArrowDown size={60} className="mx-4 flex md:hidden" />
                  {evolutionExtractedInfoFinal
                    ? `(${evolutionExtractedInfoFinal})`
                    : `(${evolutionExtractedInfoNext})`}
                </div>
                {finalPokemon}
              </div>
            )}
          </div>
        </div>
      )

      // For regular, linear evolutions.
    } else if (!currentPokemonData.isSplitEvo) {
      return (
        <div
          className="flex flex-col items-center justify-center sm:flex-col md:flex-row"
          key={index}
        >
          {pokemon}
          {index !== individualPokemon.length - 1 && !currentPokemonData.nextEvoSplit && (
            <>
              <div className="hidden w-full flex-col items-center justify-center text-center sm:hidden md:flex md:w-48">
                <BsArrowRight size={60} className="mx-4" />
                {`(${evolutionExtractedInfo})`}
              </div>
              <div className="flex w-full flex-col items-center justify-center text-center sm:flex md:hidden md:w-48">
                <BsArrowDown size={60} className="my-2" />
                {`(${evolutionExtractedInfo})`}
              </div>
            </>
          )}
        </div>
      )
    } else {
      return null
    }
  })
}

// A function to find all the keys of an object that are not null, false or ''
function nonNullValues(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => value !== null && value !== false && value !== ''),
  )
}

const EvolutionChain = ({ url }) => {
  const { data: evolutionData, isLoading } = useQuery({
    queryKey: ['evolution-chain', url],
    queryFn: ({ signal }) => fetchData(url, signal),
    staleTime: Infinity,
    cacheTime: Infinity,
  })

  // Use a recursive function to fetch the data of all the pokemon within the evolution chain.
  const getAllData = () => {
    const information = []

    const traverseChain = (chain) => {
      const {
        evolution_details,
        evolves_to: evolvesTo,
        species: { name: speciesName = '', url: speciesUrl = '' },
      } = chain || {}
      const idNumber = parseInt(speciesUrl.match(/\/(\d+)\/$/)[1])

      const evoDetailsNew = evolution_details.map(nonNullValues) || []

      information.push({
        id: idNumber,
        evolutionDetails: evoDetailsNew,
        speciesName,
        speciesUrl,
        nextEvoSplit: evolvesTo.length > 1,
      })

      if (evolvesTo.length > 0) {
        evolvesTo.forEach((evolution) => {
          traverseChain(evolution)
        })
      }
    }
    if (evolutionData?.chain) {
      traverseChain(evolutionData.chain)
    }
    return information
  }

  const evolutionChainData = getAllData()

  // Find the urls of all the pokemon in the evolution chain.
  // Find the Pokemon Url, NOT the species url.
  const pokemonUrls = evolutionChainData.map((pokemon) => {
    return `https://pokeapi.co/api/v2/pokemon/${pokemon.id}/`
  })

  // Then perform a get request on all this data, then get the home sprite, and name of the pokemon.
  const { data: allPokemonData, isLoading: isLoadingPokemonData } = useQueries({
    queries: pokemonUrls
      ? pokemonUrls.map((pokemonUrl) => {
          return {
            queryKey: ['evolution-chain', pokemonUrl],
            queryFn: () => fetchData(pokemonUrl),
            staleTime: Infinity,
            cacheTime: Infinity,
            select: (pokemon) => {
              const extractedInformation = extractPokemonInformation(pokemon)
              const { name, homeSprite, id, types } = extractedInformation
              return { name, homeSprite, id, types }
            },
          }
        })
      : [],
    combine: (results) => {
      return {
        data: results.map((result) => result.data),
        isLoading: results.some((result) => result.isLoading),
      }
    },
  })

  // Now perform a join operation on allPokemonData and evolutionChainData on the basis of the pokemon id.
  const preFinalPokemonData = allPokemonData?.map((pokemon) => {
    const species = evolutionChainData?.find((species) => species?.id === pokemon?.id)
    return { ...pokemon, ...species }
  })

  /* 
    Peform an operation for identifying whether the evolution is part of a split evolution.
    However, an exception needs to be made for the Wurmple chain.
  */

  let foundNextEvoSplit = false
  const finalPokemonDataOld = preFinalPokemonData?.map((obj) => {
    const isSplitEvo = foundNextEvoSplit
    if (obj.nextEvoSplit) {
      foundNextEvoSplit = true
    }

    return { ...obj, isSplitEvo }
  })

  // 267 and 269 are for the Wurmple evolution chain.
  // 123 is for Scyther, which has a split evolution in gen 8.
  // 212 is for Scizor. 215 for Sneasel, 194 for Wooper
  // Meowth has a gen 8+ split evolution, so it needs to be dealt with as well.
  // Meowth = 52, Persian = 53, Weavile = 461
  // Also filter out gen 8+ forms.
  const finalPokemonData = finalPokemonDataOld
    ?.map((pokemon) => {
      let { isSplitEvo: splitEvoFlag, id, nextEvoSplit } = pokemon
      if (id === 267 || id === 269 || id === 212 || id === 53 || id === 461 || id === 195) {
        splitEvoFlag = false
      }
      if (id === 123 || id === 52 || id === 215 || id === 194) {
        nextEvoSplit = false
      }
      return { ...pokemon, isSplitEvo: splitEvoFlag, nextEvoSplit }
    })
    ?.filter((pokemon) => {
      const { id } = pokemon
      return (id >= 1 && id <= 809) || (id >= 10001 && id <= 10157)
    })

  // Define divs for each pokemon in the evolution chain.
  const individualPokemon = finalPokemonData?.map((pokemon, index) => (
    <PokemonCard pokemonData={pokemon} splitEvoFlag={pokemon.isSplitEvo} key={index} />
  ))

  // Eevee is a special case which will be dealt with here.
  const firstPokemonName = (finalPokemonData ?? [])[0]?.name || ''
  let finalEvolutionDiv = undefined
  let eeveelutionDiv = []
  let wurmpleDiv = []

  if (firstPokemonName === 'eevee') {
    // For the first three eveelutions
    let stoneEvolutionsData = [
      finalPokemonData[0],
      finalPokemonData[1],
      finalPokemonData[2],
      finalPokemonData[3],
    ]
    let stoneEvolutionsDivs = [
      individualPokemon[0],
      individualPokemon[1],
      individualPokemon[2],
      individualPokemon[3],
    ]
    eeveelutionDiv.push(
      <EvolutionDiv
        finalPokemonData={stoneEvolutionsData}
        individualPokemon={stoneEvolutionsDivs}
      />,
    )

    // For the friendship ones
    let friendEvolutionsData = [finalPokemonData[0], finalPokemonData[4], finalPokemonData[5]]
    let friendEvolutionsDivs = [individualPokemon[0], individualPokemon[4], individualPokemon[5]]
    eeveelutionDiv.push(
      <EvolutionDiv
        finalPokemonData={friendEvolutionsData}
        individualPokemon={friendEvolutionsDivs}
      />,
    )

    // For the location ones
    let locationEvolutionsData = [
      finalPokemonData[0],
      finalPokemonData[6],
      finalPokemonData[7],
      finalPokemonData[8],
    ]
    let locationEvolutionsDivs = [
      individualPokemon[0],
      individualPokemon[6],
      individualPokemon[7],
      individualPokemon[8],
    ]
    eeveelutionDiv.push(
      <EvolutionDiv
        finalPokemonData={locationEvolutionsData}
        individualPokemon={locationEvolutionsDivs}
      />,
    )
  } else if (firstPokemonName === 'wurmple') {
    let wormData = [finalPokemonData[0], finalPokemonData[1], finalPokemonData[3]]
    let wormDivs = [individualPokemon[0], individualPokemon[1], individualPokemon[3]]
    wurmpleDiv.push(<EvolutionDiv finalPokemonData={wormData} individualPokemon={wormDivs} />)

    // For beautifly
    const wurmpleEvsData = finalPokemonData?.map((pokemon) => {
      let { isSplitEvo: splitEvoFlag, id, nextEvoSplit } = pokemon
      if (id === 266 || id === 268) {
        splitEvoFlag = false
      }
      return { ...pokemon, isSplitEvo: splitEvoFlag, nextEvoSplit }
    })
    const individualWormPokemon = wurmpleEvsData?.map((pokemon, index) => (
      <PokemonCard pokemonData={pokemon} splitEvoFlag={pokemon.isSplitEvo} key={index} />
    ))

    let butterflyData = [wurmpleEvsData[1], wurmpleEvsData[2]]
    let butterflyDivs = [individualWormPokemon[1], individualWormPokemon[2]]
    wurmpleDiv.push(
      <EvolutionDiv finalPokemonData={butterflyData} individualPokemon={butterflyDivs} />,
    )

    // For dustox
    let mothData = [wurmpleEvsData[3], wurmpleEvsData[4]]
    let mothDivs = [individualWormPokemon[3], individualWormPokemon[4]]
    wurmpleDiv.push(<EvolutionDiv finalPokemonData={mothData} individualPokemon={mothDivs} />)
  } else {
    finalEvolutionDiv = (
      <EvolutionDiv finalPokemonData={finalPokemonData} individualPokemon={individualPokemon} />
    )
  }

  return (
    <>
      <SectionTitle text="Evolution Chart" />
      {isLoading || isLoadingPokemonData ? (
        <Skeleton width="100%" height="12rem" containerClassName="flex-1 w-full" />
      ) : finalEvolutionDiv ? (
        <div className="flex flex-col justify-center gap-x-5 sm:flex-col md:flex-row">
          {finalEvolutionDiv}
        </div>
      ) : eeveelutionDiv.length > 0 ? (
        eeveelutionDiv.map((div, index) => {
          return (
            <div
              className="flex flex-col justify-between gap-y-5 sm:flex-col sm:justify-center md:flex-row"
              key={index}
            >
              {div}
            </div>
          )
        })
      ) : (
        wurmpleDiv.map((div, index) => {
          return (
            <div
              className="flex flex-col justify-between gap-y-5 sm:flex-col sm:justify-center md:flex-row"
              key={index}
            >
              {div}
            </div>
          )
        })
      )}
    </>
  )
}

export default EvolutionChain
