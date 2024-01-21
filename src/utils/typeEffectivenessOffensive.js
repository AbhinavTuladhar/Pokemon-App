// On the basis of the given type combination, find how much damage an attacking type will inflict.

const calculateOffensiveTypeEffectiveness = ({ defendingTypeCombination, attackingTypeInfo }) => {
  if (!defendingTypeCombination || !attackingTypeInfo) return

  const { doubleDamageTo, halfDamageTo, noDamageTo } = attackingTypeInfo

  const multiplierMapping = [
    { typeList: doubleDamageTo, multiplier: 2 },
    { typeList: halfDamageTo, multiplier: 0.5 },
    { typeList: noDamageTo, multiplier: 0 },
  ]

  let totalEffectiveness = 1

  multiplierMapping.forEach(({ typeList, multiplier }) => {
    defendingTypeCombination.forEach((defendingType) => {
      if (typeList.includes(defendingType)) {
        totalEffectiveness *= multiplier
      }
    })
  })

  return totalEffectiveness
}

export default calculateOffensiveTypeEffectiveness
