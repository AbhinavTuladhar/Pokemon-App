// This is for extracting the information of the moves
const extractMoveInformation = move => {
  if (!move) return
  const { 
    accuracy,
    damage_class: { name: damageClass},
    effect_chance,
    flavor_text_entries,
    generation: { name: generationIntroduced },
    meta : { 
      ailment : { name: ailmentName },
      ailment_chance: ailmentChance,
      crit_rate: criteRate,
      drain,
      flinch_chance: flinchChance,
      category: { name: moveCategory },
      stat_chance: statChance
    },
    name: moveName,
    power,
    pp: PP,
    priority,
    target: { name: targetType},
    type: { name: moveType}
} = move
  // Find the english entry of ORAS.
  const ORASDescription = flavor_text_entries.find(entry =>
    entry.language.name === 'en' && entry.version_group.name === 'omega-ruby-alpha-sapphire'
  )
  const realAccuracy = accuracy === null ? '-' : accuracy
  const realPower = power === null ? '-' : power
  return {
    accuracy: realAccuracy,
    damageClass,
    effect_chance,
    generationIntroduced,
    ailmentName,
    ailmentChance,
    criteRate,
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
    description: ORASDescription.flavor_text
  };
}

export default extractMoveInformation