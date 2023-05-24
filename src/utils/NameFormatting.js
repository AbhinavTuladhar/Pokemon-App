// This is for capitalising the first letter of a word.
const capitaliseFirstLetter = word => {
  return word?.charAt(0).toUpperCase() + word?.slice(1)
}

const formatName = name => {
  // Split the name by hyphen to and capitalise the first letter of each word.
  const wordList = name?.split('-')
  let properWordList = wordList?.map(word => capitaliseFirstLetter(word))
  // If it's a mega evolution, reverse the array, then join them with spaces.
  if (properWordList?.includes('Mega')) {
    if (properWordList?.length === 3) {
      const [name, mega, suffix] = properWordList
      return `${mega} ${name} ${suffix}`
    }
    return properWordList?.reverse().join(' ')
  }
  return properWordList?.join(' ')
}

export default formatName