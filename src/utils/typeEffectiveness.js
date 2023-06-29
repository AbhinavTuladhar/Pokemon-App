const calculateTypeEffectiveness = typeInfo => {
  if (!typeInfo) return
  
  const typeList = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground',
    'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
  ]
  const typeEffectivenessList = typeList.reduce((acc, curr) => {
    acc[curr] = 1
    return acc
  }, {})

  typeInfo.forEach(type => {
    const { doubleDamageFrom, halfDamageFrom, noDamageFrom } = type
    
    const multiplierMapping = [
      { typeList: doubleDamageFrom, multiplier: 2},
      { typeList: halfDamageFrom, multiplier: 0.5},
      { typeList: noDamageFrom, multiplier: 0},
    ]
  
    multiplierMapping?.forEach(row => {
      row?.typeList?.forEach(type => {
        typeEffectivenessList[type] *= row.multiplier
      })
    })
  })

  return typeEffectivenessList
}

export default calculateTypeEffectiveness