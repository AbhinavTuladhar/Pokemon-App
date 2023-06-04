import generationMapping from "./generationMapping"
import formatName from "./NameFormatting";

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

  // Converting Roman to Hindu-Arabic numerals.
  const numberMapper = {
    'i': '1',
    'ii': '2',
    'iii': '3',
    'iv': '4',
    'v': '5',
    'vi': '6',
  }
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

export default extractSpeciesInformation