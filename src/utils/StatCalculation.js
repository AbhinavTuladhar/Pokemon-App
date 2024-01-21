/*
input: [
  { name: HP, value: 120 },
  { name: Attack, value: 120 }...
]

output = [
  { name: HP, max: 120, min: 50 },
  { name: Attack, max: 120, min: 50 }
]
*/
// First make some functions to calculate the stat on the basis of base, EV, IV and nature.

// There is a separate formula for HP, so it is defined here.
const calculateHP = ({ base, EV, IV, level }) => {
  const term1 = Math.floor(((2 * base + IV + Math.floor(EV / 4)) * level) / 100)
  const finalTerm = term1 + level + 10
  return finalTerm
}

// This formula is for the rest of the stats.
const calculateStat = ({ base, EV, IV, level, nature }) => {
  const numerator = (2 * base + IV + Math.floor(EV / 4)) * level
  const firstTerm = Math.floor(numerator / 100)
  const finalTerm = (firstTerm + 5) * nature
  return Math.floor(finalTerm)
}

// statData is the array of objects as described above.
const statCalculator = (statData) => {
  const minMaxValues = statData.map((stat) => {
    let minStat, maxStat
    // Make an exception for HP
    if (stat.name === 'HP' && stat.value === 1) {
      minStat = 1
      maxStat = 1
    } else if (stat.name === 'HP') {
      minStat = calculateHP({ base: stat.value, EV: 0, IV: 0, level: 100 })
      maxStat = calculateHP({ base: stat.value, EV: 255, IV: 31, level: 100 })
    } else {
      minStat = calculateStat({ base: stat.value, EV: 0, IV: 0, level: 100, nature: 0.9 })
      maxStat = calculateStat({ base: stat.value, EV: 255, IV: 31, level: 100, nature: 1.1 })
    }
    return { name: stat.name, min: minStat, max: maxStat }
  })
  return minMaxValues
}

export default statCalculator
