import formatName from "./NameFormatting"

const evolutionStringFinder = evolutionDetails => {
  const [ evolutionStep ] = evolutionDetails || []

  if (evolutionStep?.length === 0 || evolutionStep?.length > 1 || evolutionStep === undefined) {
    return
  }

  const { trigger: { name: triggerName = '' } } = evolutionStep
  
  switch(triggerName) {
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
        needs_overworld_rain = false
      } = evolutionStep

      const genderName = gender === 2 ? 'Male' : 'Female'

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
      }else if (knownMove) {
        return `after ${formatName(knownMove)} learned`
      } else if (locationName) {
        return `level up in ${formatName(locationName)}`
      } else if (min_happiness !== undefined) {
        return ('high happiness')
      } else if (needs_overworld_rain) {
        return `level ${min_level}, rain`
      } else if (min_beauty) {
        return `level up with max beauty`
      }
      return `level ${min_level}`

    case 'trade':
      const {
        held_item: { name: heldItemTrade = undefined } = {},
      } = evolutionStep
      if (heldItemTrade) {
        return `trade holding ${formatName(heldItemTrade)}`
      }
      return ('trade')

    case 'use-item':
      const { 
        item: { name: itemName },
        gender: genderForItem = undefined
      } = evolutionStep

      const genderNameForItem = genderForItem === 2 ? 'Male' : 'Female'
      if (genderForItem) {
        return `use ${formatName(itemName)}, ${genderNameForItem}`
      }

      return `use ${formatName(itemName)}`

    default:
      return ('Some uncoded method')
  }
}

export default evolutionStringFinder