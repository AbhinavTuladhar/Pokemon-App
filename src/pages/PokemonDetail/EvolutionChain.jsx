import React from 'react'
import { useQuery } from 'react-query'
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
      <>
        <TypeCard typeName={typeName} useTextOnly={true} />
        {index !== types.length - 1 && <span> · </span>}
      </>
    )
  })

  // For the identifying number
  const formattedId = `#${('00' + id).slice(-3)}`

  return (
    <div 
      className={`flex ${splitEvoFlag ? 'flex-col' : 'flex-row sm:flex-row md:flex-col'} justify-center items-center gap-y-2`}
    >
      <img src={homeSprite} alt={name} className='h-32 aspect-square' />
      <div className='flex flex-col items-center justify-center'>
        { formattedId }
        <NavLink 
          to={`/pokemon/${id}`} 
          className='font-bold hoverable-link'
        > 
          { formatName(name) }
        </NavLink>
        <span className='text-center'>
          { typeDiv }
        </span>
      </div>
    </div>
  )
}

const EvolutionDiv = ({ individualPokemon, finalPokemonData }) => {
  const firstPokemonName = (finalPokemonData ?? [])[0]?.name || "";
  const wurmpleFlag = firstPokemonName === 'wurmple'

  return individualPokemon?.map((pokemon, index) => {
    const currentPokemonData = finalPokemonData[index]
    const pokemonData = finalPokemonData[(index + 1) % individualPokemon.length]
    const nextnextData = finalPokemonData[(index + 2) % individualPokemon.length]

    const nextPokemon = wurmpleFlag ? individualPokemon[(index + 1)] : individualPokemon[(index + 1) % individualPokemon.length]
    const nextNextPokemon = wurmpleFlag ? individualPokemon[(index + 3) % individualPokemon.length] : individualPokemon[(index + 2) % individualPokemon.length]
    
    const { evolutionDetails } = pokemonData
    const { evolutionDetails: nextnextEvoDetail } = nextnextData
    
    const evolutionExtractedInfo = evolutionStringFinder(evolutionDetails)
    const evolutionExtractedInfoNext = evolutionStringFinder(nextnextEvoDetail)
    
    // This is for a three-way evolution
    const finalPokemon = wurmpleFlag ? undefined : individualPokemon[(index + 3)]
    const lastPokemonData = finalPokemonData[(index + 3)]
    const { evolutionDetails: finalEvoDetail } = lastPokemonData || {}
    const evolutionExtractedInfoFinal = evolutionStringFinder(finalEvoDetail)

    // For split evolutions
    /*
    Note: the middle arrow is only for a three-way evoltuion.
    */ 
    if (currentPokemonData.nextEvoSplit) {
      return (
        <>
          { pokemon }
          <div className='flex flex-row md:flex-col gap-y-10 justify-between'>
            <div className='md:flex-row flex-col text-center flex justify-center items-center'>
              <div className='flex flex-col w-28 mx-4 justify-center items-center'>
                <BsArrowUpRight size={60} className='md:flex hidden' />
                <BsArrowDown size={60} className='mx-4 md:hidden flex' />
                { `(${evolutionExtractedInfo})` }
              </div>
              { nextPokemon }
            </div>
            <div className='md:flex-row flex-col text-center flex justify-center items-center'>
              <div className='flex flex-col w-28 mx-4 justify-center items-center'>
                {
                  finalPokemon
                  ?
                  <BsArrowRight size={60} className='md:flex hidden' />
                  :
                  <BsArrowDownRight size={60} className='md:flex hidden' />
                }
                <BsArrowDown size={60} className='mx-4 md:hidden flex' />
                { `(${evolutionExtractedInfoNext})` }
              </div>
              { nextNextPokemon }
            </div>
            { 
              finalPokemon &&
              <div className='md:flex-row flex-col text-center flex justify-center items-center'>
                <div className='flex flex-col w-28 mx-4 justify-center items-center'>
                  <BsArrowDownRight size={60} className='md:flex hidden' />
                  <BsArrowDown size={60} className='mx-4 md:hidden flex' />
                  { 
                    evolutionExtractedInfoFinal 
                    ?
                    `(${evolutionExtractedInfoFinal})`
                    :
                    `(${evolutionExtractedInfoNext})`
                  }
                </div>
                { finalPokemon }
              </div>
            }
          </div>
        </>
      )

    // For regular, linear evolutions.
    } else if (!currentPokemonData.isSplitEvo) {
      return (
        <div className='flex flex-col md:flex-row sm:flex-col justify-center items-center'>
          { pokemon }
          { 
            (index !== individualPokemon.length - 1) && (!currentPokemonData.nextEvoSplit) &&
            (
              <>
                <div className='md:flex flex-col sm:hidden text-center hidden justify-center items-center w-28'>
                  <BsArrowRight size={60} className='mx-4' />
                  { `(${evolutionExtractedInfo})` }
                </div>
                <div className='md:hidden sm:flex text-center flex flex-col justify-center items-center w-28'>
                  <BsArrowDown size={60} className='my-2' />
                  { `(${evolutionExtractedInfo})` }
                </div>
              </>
            )
          }
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
    Object.entries(obj).filter(([key, value]) => value !== null && value !== false && value !== '')
  )
}

const EvolutionChain = ({ url }) => {
  const { data: evolutionData, isLoading } = useQuery(
    [url],
    () => fetchData(url),
    { staleTime: Infinity, cacheTime: Infinity }
  )

  // Use a recursive function to fetch the data of all the pokemon within the evolution chain.
  const getAllData = () => {
    const information = []

    const traverseChain = chain => {
      const {
        evolution_details,
        evolves_to: evolvesTo,
        species : { name: speciesName = '', url: speciesUrl = '' }
      } = chain || {}
      const idNumber = parseInt(speciesUrl.match(/\/(\d+)\/$/)[1])
  
      const evoDetailsNew = evolution_details.map(nonNullValues) || []
  
      information.push({
        id: idNumber,
        evolutionDetails: evoDetailsNew,
        speciesName,
        speciesUrl,
        nextEvoSplit: evolvesTo.length > 1
      })
  
      if (evolvesTo.length > 0) {
        evolvesTo.forEach(evolution => {
          traverseChain(evolution)
        })
      }
    }
    if (evolutionData?.chain) {
      traverseChain(evolutionData.chain);
    }
    return information
  }

  const evolutionChainData = getAllData()
  
  // Find the urls of all the pokemon in the evolution chain.
  // Find the Pokemon Url, NOT the species url.
  const pokemonUrls = evolutionChainData.map(pokemon => {
    return `https://pokeapi.co/api/v2/pokemon/${pokemon.id}/`
  })

  // Then perform a get request on all this data, then get the home sprite, and name of the pokemon.
  const { data: allPokemonData, isLoading: isLoadingPokemonData } = useQuery(
    pokemonUrls,
    () => Promise.all(pokemonUrls.map(fetchData)),
    { 
      staleTime: Infinity,
      cacheTime: Infinity, 
      select: pokemonDataList => {
        return pokemonDataList.map(pokemon => {
          const extractedInformation = extractPokemonInformation(pokemon)
          const { name, homeSprite, id, types } = extractedInformation
          return { name, homeSprite, id, types }
        })
      }
    }
  )

  // Now perform a join operation on allPokemonData and evolutionChainData on the basis of the pokemon id.
  const preFinalPokemonData = allPokemonData?.map(pokemon => {
    const species = evolutionChainData?.find(species => species.id === pokemon.id)
    return { ...pokemon, ...species }
  })

  /* 
    Peform an operation for identifying whether the evolution is part of a split evolution.
    However, an exception needs to be made for the Wurmple chain.
  */
 
 let foundNextEvoSplit = false;
 const finalPokemonDataOld = preFinalPokemonData?.map((obj) => {
    const isSplitEvo = foundNextEvoSplit;
    if (obj.nextEvoSplit) {
      foundNextEvoSplit = true;
    }

    return { ...obj, isSplitEvo };
  });
  
  const finalPokemonData = finalPokemonDataOld?.map(pokemon => {
    let { isSplitEvo: splitEvoFlag, id } = pokemon
    if (id === 267 || id === 269 ) {
      splitEvoFlag = false
    }
    return { ...pokemon, isSplitEvo: splitEvoFlag }
  })
  
  console.log(finalPokemonData)
  
  // Define divs for each pokemon in the evolution chain.
  const individualPokemon = finalPokemonData?.map(pokemon => <PokemonCard pokemonData={pokemon} splitEvoFlag={pokemon.isSplitEvo} />)
  
  // Eevee is a special case which will be dealt with here.
  const firstPokemonName = (finalPokemonData ?? [])[0]?.name || "";
  let finalEvolutionDiv = undefined
  let eeveelutionDiv = []
  
  if (firstPokemonName !== 'eevee') {
    finalEvolutionDiv = <EvolutionDiv finalPokemonData={finalPokemonData} individualPokemon={individualPokemon} />
  } else {
    // For the first three eveelutions
    let stoneEvolutionsData = [
      finalPokemonData[0],
      finalPokemonData[1],
      finalPokemonData[2],
      finalPokemonData[3]
    ]
    let stoneEvolutionsDivs = [
      individualPokemon[0],
      individualPokemon[1],
      individualPokemon[2],
      individualPokemon[3]
    ]
    eeveelutionDiv.push(<EvolutionDiv finalPokemonData={stoneEvolutionsData} individualPokemon={stoneEvolutionsDivs} />)

    // For the friendship ones
    let friendEvolutionsData = [
      finalPokemonData[0],
      finalPokemonData[4],
      finalPokemonData[5],
    ]
    let friendEvolutionsDivs = [
      individualPokemon[0],
      individualPokemon[4],
      individualPokemon[5],
    ]
    eeveelutionDiv.push(<EvolutionDiv finalPokemonData={friendEvolutionsData} individualPokemon={friendEvolutionsDivs} />)

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
    eeveelutionDiv.push(<EvolutionDiv finalPokemonData={locationEvolutionsData} individualPokemon={locationEvolutionsDivs} />)
  }

  return (
    <>
      <SectionTitle text='Evolution Chart' />
      {
        isLoading || isLoadingPokemonData
        ?
        <Skeleton width='100%' height='12rem' containerClassName='flex-1 w-full' />
        :
        finalEvolutionDiv
        ?
        <div className='flex flex-col md:flex-row sm:flex-col justify-center gap-x-5'>
          { finalEvolutionDiv }
        </div>
        :
        <> 
          { 
            eeveelutionDiv.map(div => {
              return (
                <div className='flex flex-col md:flex-row sm:flex-col justify-between sm:justify-center gap-y-5'> 
                  { div } 
                </div>
              )
            })
          }
        </>
      }
    </>
  )
}

export default EvolutionChain