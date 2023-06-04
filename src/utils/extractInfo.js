import generationMapping from "./generationMapping"
import formatName from "./NameFormatting";

// Converting Roman to Hindu-Arabic numerals.
const numberMapper = {
  'i': '1',
  'ii': '2',
  'iii': '3',
  'iv': '4',
  'v': '5',
  'vi': '6',
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
    machines
  };
}

export const extractPokemonInformation = (data) => {
  const { 
    id,
    name,
    sprites: { other: { 'official-artwork': { front_default, front_shiny }}},
    species: { url: speciesLink }
  } = data;
  return {
    id,
    name: formatName(name),
    defaultSprite: front_default, 
    shinySprite: front_shiny,
    speciesUrl: speciesLink
  }
};

export const extractSpeciesInformation = data => {
  const  { 
    genera, 
    flavor_text_entries, 
    base_happiness, 
    capture_rate, 
    growth_rate : {name: growthRateType},
    pokedex_numbers,
    gender_rate,
    egg_groups,
    hatch_counter
  } = data
  // Find only the English genus name of the 'mon.
  const englishGenus = genera.find(entry => entry.language.name === 'en')
  return {
    genus: englishGenus.genus,
    growth_rate: growthRateType,
    base_happiness,
    capture_rate,
    pokedex_numbers,
    gender_rate,
    egg_groups,
    hatch_counter,
    flavor_text_entries
  }
}

export const extractTypeInformation = data => {
  const {
    damage_relations: damageRelations,
    moves: moveList,
    pokemon: pokemonList,
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
    pokemonList: pokemonList,
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
      versionName: entry.version_group.name
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
    name: formatName(name),
    pokemonCount
  }
}