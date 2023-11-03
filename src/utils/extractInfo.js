import generationMapping from "./generationMapping"
import { generationMappingV3, generationMappingV3Internal } from "./generationMappingV3"

// Converting Roman to Hindu-Arabic numerals.
const numberMapper = {
  'i': '1',
  'ii': '2',
  'iii': '3',
  'iv': '4',
  'v': '5',
  'vi': '6',
  'vii': '7'
}

// This is for extracting the information of the moves
export const extractMoveInformation = move => {
  if (!move) return
  const { 
    accuracy,
    damage_class: { name: damageClass},
    effect_chance,
    effect_entries,
    flavor_text_entries,
    generation: { name: generation },
    learned_by_pokemon,
    meta : { 
      ailment : { name: ailmentName },
      ailment_chance: ailmentChance,
      crit_rate: critRate,
      drain,
      flinch_chance: flinchChance,
      category: { name: moveCategory },
      stat_chance: statChance
    },
    id,
    machines,
    name: moveName,
    power,
    pp: PP,
    priority,
    target: { name: targetType},
    type: { name: moveType}
  } = move

  // Find all the English etnries.
  const englishDescriptions = flavor_text_entries
    .filter(entry => entry.language.name === 'en')
    .map(version => ({
      description: version.flavor_text,
      version: version.version_group.name,
      generation: generationMapping[version.version_group.name]
    }))

  // Find the English effect entry.
  const englishEffect = effect_entries.find(entry => 
    entry.language.name === 'en'
  )

  // Separate the long and short entries.
  const longEntry = englishEffect.effect
  const shortEntry = englishEffect.short_effect

  // Find the URLs of all the Pokemon that can learn the move.
  const pokemonUrls = learned_by_pokemon?.map(pokemon => pokemon.url)

  // Dealing with keys which might have null values.
  const realAccuracy = accuracy === null ? '-' : accuracy
  const realPower = power === null ? '-' : power
  const realEffectChance = effect_chance === null ? '-' : effect_chance

  const [ generationString, generationNumber ] = generation.split('-')
  const newGenerationString = generationString.charAt(0).toUpperCase() + generationString.slice(1)
  const generationIntroduced = `${newGenerationString} ${numberMapper[generationNumber]}`

  return {
    accuracy: realAccuracy,
    damageClass,
    effect_chance: realEffectChance,
    generationIntroduced,
    ailmentName,
    ailmentChance,
    critRate,
    drain,
    flinchChance,
    statChance,
    moveName,
    power: realPower,
    PP,
    priority,
    targetType,
    moveType,
    moveCategory,
    descriptions: englishDescriptions,
    longEntry,
    shortEntry,
    id,
    machines,
    pokemonUrls
  };
}

export const extractPokemonInformation = data => {
  const {
    abilities,
    base_experience,
    forms,
    game_indices,
    height,
    id,
    moves,
    name,
    order,
    species: { url: speciesLink },
    sprites: { 
      other: { 
        'official-artwork': { front_default, front_shiny },
        'home': { front_default: homeSprite }
      },
      versions: { 
        'generation-i': { yellow: { front_default: firstGenDefaultSprite }},
        'generation-ii': { crystal: { front_default: secondGenDefaultSprite, front_shiny: secondGenShinySprite }},
        'generation-iii': { emerald: { front_default: thirdGenDefaultSprite, front_shiny: thirdGenShinySprite }},
        'generation-iv': { platinum: { front_default: fourthGenDefaultSprite, front_shiny: fourthGenShinySprite }},
        'generation-v': { 'black-white': { front_default: fifthGenDefaultSprite, front_shiny: fifthGenShinySprite }},
        'generation-vi': { 'omegaruby-alphasapphire': { front_default: sixthGenDefaultSprite, front_shiny: sixthGenShinySprite }},
        'generation-vii': { 'ultra-sun-ultra-moon': { front_default: gameSprite, front_shiny: sevenGenthShinySprite } },
        'generation-viii': { icons: { front_default: icon }}
      }
    },
    stats,
    types,
    weight
  } = data

  const spriteCollection = [
    { generation: 'Generation 1', frontSprite: firstGenDefaultSprite, shinySprite: null },
    { generation: 'Generation 2', frontSprite: secondGenDefaultSprite, shinySprite: secondGenShinySprite },
    { generation: 'Generation 3', frontSprite: thirdGenDefaultSprite, shinySprite: thirdGenShinySprite },
    { generation: 'Generation 4', frontSprite: fourthGenDefaultSprite, shinySprite: fourthGenShinySprite },
    { generation: 'Generation 5', frontSprite: fifthGenDefaultSprite, shinySprite: fifthGenShinySprite },
    { generation: 'Generation 6', frontSprite: sixthGenDefaultSprite, shinySprite: sixthGenShinySprite },
    { generation: 'Generation 7', frontSprite: gameSprite, shinySprite: sevenGenthShinySprite },
    { generation: 'Icon', frontSprite: icon, shinySprite: null }
  ]

  const nationalNumber = parseInt(speciesLink.match(/\/(\d+)\/$/)[1])
  return {
    abilities,
    base_experience,
    forms,
    game_indices,
    height,
    homeSprite,
    id,
    moves,
    name,
    nationalNumber,
    order,
    speciesLink,
    front_default,
    front_shiny,
    gameSprite,
    icon,
    spriteCollection,
    stats,
    types,
    weight
  }
}

export const extractSpeciesInformation = data => {
  const  { 
    base_happiness, 
    capture_rate, 
    egg_groups,
    evolution_chain: { url: evolutionChainUrl },
    flavor_text_entries, 
    gender_rate,
    genera, 
    generation: { name: generationIntroduced },
    growth_rate : {name: growthRateType},
    hatch_counter,
    id,
    names,
    pokedex_numbers,
    varieties
  } = data
  
  // Find only the English genus name of the 'mon.
  const englishGenus = genera.find(entry => entry.language.name === 'en')
  return {
    base_happiness,
    capture_rate,
    egg_groups,
    evolutionChainUrl,
    flavor_text_entries,
    gender_rate,
    generationIntroduced,
    genera,
    genus: englishGenus.genus,
    growth_rate: growthRateType,
    hatch_counter,
    id,
    names,
    pokedex_numbers,
    varieties
  }
}

export const extractTypeInformation = data => {
  const {
    damage_relations: damageRelations,
    moves: moveList,
    pokemon: pokemonList,
    name
  } = data
  const {
    double_damage_from: doubleDamageFrom,
    double_damage_to: doubleDamageTo,
    half_damage_from: halfDamageFrom,
    half_damage_to: halfDamageTo,
    no_damage_from: noDamageFrom,
    no_damage_to: noDamageTo
  } = damageRelations

  const extractName = arr => arr.map(type => type.name)

  return {
    doubleDamageFrom: extractName(doubleDamageFrom),
    doubleDamageTo: extractName(doubleDamageTo),
    halfDamageFrom: extractName(halfDamageFrom),
    halfDamageTo: extractName(halfDamageTo),
    noDamageFrom: extractName(noDamageFrom),
    noDamageTo: extractName(noDamageTo),
    moveList: moveList,
    pokemonList: pokemonList.map(pokemon => pokemon.pokemon.url),
    name
  }
}

export const extrctAbilityInformation = data => {
  if (!data)
    return
  const {
    effect_entries,
    flavor_text_entries,
    generation: { name: generationIntroducedRaw },
    id,
    name,
    pokemon
  } = data

  // Find the English long and short entries.
  const englishDescEntries = effect_entries.find(entry => entry.language.name === 'en')
  const { short_effect: shortEntry, effect: longEntry } = englishDescEntries

  // Find the version-wise descriptions
  const descriptions = flavor_text_entries.filter(entry => entry.language.name === 'en')
    .map(entry => ({
      description: entry.flavor_text,
      versionName: entry.version_group.name,
      generation: generationMapping[entry.version_group.name]
    }))
  
  // The number of Pokemon that have the ability.
  const pokemonCount = pokemon.length

  const [ generationString, generationNumber ] = generationIntroducedRaw.split('-')
  const newGenerationString = generationString.charAt(0).toUpperCase() + generationString.slice(1)
  const generationIntroduced = `${newGenerationString} ${numberMapper[generationNumber]}`


  return {
    shortEntry,
    longEntry,
    descriptions,
    generationIntroduced: generationIntroduced,
    id,
    name,
    pokemonCount,
    pokemon
  }
}

export const extractRegionInformation = regionalData => {
  const {
    name: regionName,
    locations
  } = regionalData
  return { regionName, locations }
}

export const extractLocationInformation = locationData => {
  const { areas, name: locationName } = locationData
  return { subLocations: areas, locationName }
}

// To be used in extractEncounterInformation, not to be exported.
// This is for dealing with the encounter_details object.
const extractDetailedEncounterInformation = encounterData => {
  const { chance, condition_values, max_level, min_level, method: { name: methodName } } = encounterData
  // Make a string for the level range.
  return { min_level, max_level, chance, condition_values, methodName }
}

// To be used in extractLocationAreaInformation, not to be exported!
// This is for dealing with the version_details object.
const extractEncounterInformation = encounterData => {
  const { 
    pokemon: { name: pokemonName, url: pokemonUrl },
    version_details
  } = encounterData

  // To get the icon url
  const idNumber = parseInt(pokemonUrl.match(/\/(\d+)\/$/)[1])
  const iconSprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/${idNumber}.png`

  const toReturn = version_details.map(row => {
    const { 
      version: { name: gameName },
      encounter_details
    } = row
    const generation = generationMappingV3[gameName]
    // This is to keep track of the remakes
    const generationInternal = generationMappingV3Internal[gameName]

    const extractedEncounterInformation = encounter_details.map(extractDetailedEncounterInformation)
    
    return { iconSprite, pokemonName, gameName, generation, generationInternal, extractedEncounterInformation }
  })
  
  // A flatmap to attach the pokemon name and game nome to each object in the array
  const expandedDetails = toReturn.flatMap(({ iconSprite, pokemonName, gameName, generation, generationInternal, extractedEncounterInformation }) => {
    return extractedEncounterInformation.map(({...rest}) => ({iconSprite, pokemonName, gameName, generation, generationInternal, ...rest}))
  })

  // Now reduce the array of object to reduce them into more compact entries.
  // Reduction is done on the basis of the Pokemon name and name of the game.
  const reducedEncounterInformation = expandedDetails.reduce((acc, obj) => {
    const existingObject = acc.find(item => (
      obj.pokemonName === item.pokemonName && obj.gameName === item.gameName && obj.generation === item.generation
    ))

    // If there's a matching object, find the lower value of minimum level, higher value of maximum level and accumulate the encounter chance.
    if (existingObject) {
      existingObject.min_level = Math.min(existingObject.min_level, obj.min_level)
      existingObject.max_level = Math.max(existingObject.max_level, obj.max_level)
      existingObject.chance += obj.chance
    } else {
      acc.push({...obj})
    }
    return acc
  }, [])

  // Further, combine min level and max level 
  return reducedEncounterInformation.map(pokemonEncounter => {
    const { min_level, max_level } = pokemonEncounter
    const levelRange = min_level === max_level ? min_level : `${min_level}-${max_level}`
    return {...pokemonEncounter, levelRange}
  })
}

export const extractLocationAreaInformation = locationAreaData => {
  const { names, pokemon_encounters } = locationAreaData
  // For getting the 'proper' sub location name
  const properLocationAreaName = names.find(name => name.language.name === 'en').name
  // Use a flat map to convert the array of array of objects to just an array of objects.
  const encounterDetails = pokemon_encounters.map(extractEncounterInformation).flatMap(row => row)

  // Group the encounter information on the basis of the game names.
  const groupedEncounterDetailsByGame = encounterDetails?.reduce((acc, encounter) => {
    const { chance, gameName, generationInternal, levelRange, methodName, pokemonName } = encounter
    const foundEncounter = acc.find(obj => (
      obj.chance === chance &&
      obj.generationInternal === generationInternal &&
      obj.levelRange === levelRange &&
      obj.methodName === methodName &&
      obj.pokemonName === pokemonName
    ))
    if (!foundEncounter) {
      acc.push({...encounter, gameName: [gameName]})
    } else {
      foundEncounter.gameName.push(gameName)
    }
    return acc
  }, [])

  return { subLocationName: properLocationAreaName, encounterDetails: groupedEncounterDetailsByGame }
}