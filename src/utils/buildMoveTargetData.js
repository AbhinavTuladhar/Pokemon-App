/**
 * A function that is used to build the 'Move Target' diagram in the Move Details page.
 * Returns an object with three keys:
 * The first and second contain information about which ally/allies and foe(s) is/are targeted.
 * The third key contains the text to display below the diagram.
 * @param {string} targetType 
 */
export const buildMoveTargetData = targetType => {
  // First consider the base case, in which no one is the user and no one is targeted.
  const foeInformation = Array(3).fill(0).map(() => ({
    targeted: false, flag: 'foe', text: 'Foe'
  }))

  const allyInformation = Array(3).fill(0).map(() => ({
    targeted: false, flag: 'ally', text: 'Ally'
  }))

  allyInformation[0].text = 'User'

  let description

  // Now tackle each case one by one
  switch (targetType) {
    case ('ally'):
      // eg. helping hand
      description = 'Targets an adjacent Pokémon on the user’s team.'
      allyInformation[1].targeted = true
      break

    case ('users-field'):
      // eg. mist, reflect
      description = 'Targets all Pokémon on the user’s team.'
      allyInformation.forEach(ally => ally.targeted = true)
      break

    case ('user-or-ally'):
      // only eg. acupressure
      description = "Targets either the user or an adjacent Pokémon on the user’s team."
      allyInformation[0].targeted = true
      allyInformation[1].targeted = true
      break

    case ('opponents-field'):
      // eg. spikes, stealth rock
      description = 'Targets all Pokémon on the opposing field.'
      foeInformation.forEach(foe => foe.targeted = true)
      break

    case ('user'): 
    // eg. swords dance, meditate
      description = 'Targets the user.'
      allyInformation[0].targeted = true
      break

    case ('random-opponent'):
      // eg. thrash, outrage
      description = 'Targets the user, but hits a random adjacent opponent.'
      foeInformation.slice(0, 2).forEach(foe => foe.targeted = true)
      break

    case ('all-other-pokemon'):
      // eg. surf, earthquake, explosion
      description = 'Targets all adjacent Pokémon'
      allyInformation[1].targeted = true
      foeInformation.slice(0, 2).forEach(foe => foe.targeted = true)
      break

    case ('selected-pokemon'):
      // eg. pound, scratch
      description = 'Targets a single adjacent Pokémon.'
      allyInformation[1].targeted = true
      foeInformation.slice(0, 2).forEach(foe => foe.targeted = true)
      break

    case ('all-opponents'):
      // eg. leer, growl
      description = 'Targets all adjacent foes.'
      foeInformation.slice(0, 2).forEach(foe => foe.targeted = true)
      break

    case ('entire-field'):
    case ('all-pokemon'):
      // example: sandstorm, haze
      // also perish song
      description = 'Targets the entire field'
      allyInformation.forEach(ally => ally.targeted = true)
      foeInformation.forEach(foe => foe.targeted = true)
      break

    case ('user-and-allies'):
      // eg. heal bell, howl
      description = "Targets all Pokémon on the user’s team."
      allyInformation.forEach(ally => ally.targeted = true)
      break

    default:
      description = 'not programmed lmao'
      break
  }

  return({ foeInformation, allyInformation, description })
}
