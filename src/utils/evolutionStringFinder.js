import formatName from './NameFormatting'

const evolutionStringFinder = (evolutionDetails) => {
  const [evolutionStep] = evolutionDetails || []

  if (evolutionStep?.length === 0 || evolutionStep?.length > 1 || evolutionStep === undefined) {
    return
  }
  const {
    trigger: { name: triggerName = '' },
  } = evolutionStep

  switch (triggerName) {
    case 'level-up':
      const {
        min_level = undefined,
        min_happiness = undefined,
        min_beauty = undefined,
        known_move: { name: knownMove = undefined } = {},
        known_move_type: { name: knownMoveType = undefined } = {},
        min_affection = undefined,
        location: { name: locationName = undefined } = {},
        time_of_day: timeOfDay = undefined,
        held_item: { name: heldItem = undefined } = {},
        gender = undefined,
        needs_overworld_rain = false,
        relative_physical_stats = undefined,
        party_type: { name: partyPokemonType = undefined } = {},
        turn_upside_down = false,
        party_species: { name: partyPokemon = undefined } = {},
      } = evolutionStep

      // For use in various keys
      const genderName = gender === 2 ? 'Male' : 'Female'
      const statMapping = {
        '-1': 'Attack < Defence',
        0: 'Attack = Defence',
        1: 'Attack > Defence',
      }

      if (min_happiness && timeOfDay) {
        return `high happiness, ${formatName(timeOfDay)}time`
      } else if (heldItem && timeOfDay) {
        return `hold ${formatName(heldItem)} during ${formatName(timeOfDay)}time`
      } else if (min_level && timeOfDay) {
        return `level ${min_level}, ${formatName(timeOfDay)}time`
      } else if (heldItem && gender !== undefined) {
        return `use ${formatName(heldItem)}, ${genderName}`
      } else if (min_level && gender) {
        return `level ${min_level}, ${genderName}`
      } else if (knownMoveType && min_affection) {
        return `after ${formatName(knownMoveType)}-type move learned and ♥♥ affection`
      } else if (knownMove) {
        return `after ${formatName(knownMove)} learned`
      } else if (locationName) {
        switch (locationName) {
          case 'mt-coronet':
            return 'level up in magnetic field area'
          case 'eterna-forest':
            return 'level up near a mossy rock'
          case 'sinnoh-route-217':
            return 'level up near an icy rock'
          default:
            return 'Uncoded'
        }
      } else if (min_happiness !== undefined) {
        return 'high happiness'
      } else if (needs_overworld_rain) {
        return `level ${min_level}, rain`
      } else if (min_beauty) {
        return `level up with max beauty`
      } else if (relative_physical_stats !== undefined) {
        return `level ${min_level}, ${statMapping[String(relative_physical_stats)]}`
      } else if (partyPokemonType) {
        return `level ${min_level}, have ${formatName(partyPokemon)} type Pokémon in party`
      } else if (turn_upside_down) {
        return `level ${min_level}, turn device upside down`
      } else if (partyPokemon) {
        return `with ${formatName(partyPokemon)} in party`
      }
      return `level ${min_level}`

    case 'trade':
      const {
        held_item: { name: heldItemTrade = undefined } = {},
        trade_species: { name: tradeSpecies = undefined } = {},
      } = evolutionStep
      if (heldItemTrade) {
        return `trade holding ${formatName(heldItemTrade)}`
      } else if (tradeSpecies) {
        return `trade with ${formatName(tradeSpecies)}`
      }
      return 'trade'

    case 'use-item':
      const {
        item: { name: itemName },
        gender: genderForItem = undefined,
      } = evolutionStep
      const genderNameForItem = genderForItem === 2 ? 'Male' : 'Female'

      if (genderForItem) {
        return `use ${formatName(itemName)}, ${genderNameForItem}`
      }

      return `use ${formatName(itemName)}`

    case 'shed':
      return 'Level 20, empty spot in party, Pokéball in bag'

    default:
      return 'Some uncoded method'
  }
}

export default evolutionStringFinder
