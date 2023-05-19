import React from 'react'

// This is for grouping the name of the games if they have the same description for the Pokemon.
const groupByDescription = data => {
  return data?.reduce((acc, current) => {
    // First it's checked whehter the description already exists in the accumulator array.
    const index = acc.findIndex(item => item.description === current.description)
    // if it does, then append the version name.
    // Else, make a new entry in the accumulator array.
    if (index !== -1) {
      acc[index].versionName.push(current.versionName)
    } else {
      acc.push({ versionName: [current.versionName], description: current.description})
    }
    return acc
  }, [])
}

const PokeDexEntry = ( { data }) => {
  if (!Array.isArray(data)) return null

  // Let's find all the English entries first.
  const englishEntries = data.filter(entry => entry.language.name === 'en')
  
  // Find an object containing the version anme and the Pokedex entry.
  const englishInfo = englishEntries.map(entry => {
    const rawText = entry.flavor_text
    // This 'removes' the escape characters in the Pokedex entry. However, the escape characters are placed in very inconsitent places, so the text looks weird.
    const cleanedStr = rawText.replace(/\f/g, ' ').replace(/\n/g, ' ')
    const versionName = entry.version.name
    const properVersionName = versionName.charAt(0).toUpperCase() + versionName.slice(1)
    return {
      versionName: properVersionName,
      description: cleanedStr
    }
  })

  const englishInfoByDescription = groupByDescription(englishInfo)

  // Now making a list for each version
  const finalEntry = englishInfoByDescription.map(entry => {
    const gameListItems = entry.versionName.map((version, index) => {
      return <li key={index}> {version} </li>
    })
    const gameList = (<ul className='list-none list-inside'> {gameListItems} </ul>)
    return {versionName: gameList, description: entry.description }
  })

  const entryRows = finalEntry.map((entry, i) => {
    return (
      <div className='flex flex-row border-t-[1px] border-gray-200 py-2'>
        <div className='flex justify-end items-center w-2/12 text-right'> {entry.versionName} </div>
        <div className='flex justify-start items-center pl-4 w-10/12'> {entry.description} </div>
      </div>
    )
  })

  return (
    <>
      <div className='font-bold text-3xl mb-10'> Pokédex Entries </div>
      <div className='flex flex-col border-b-[1px] border-gray-200'>
        {entryRows}
      </div>
    </>
  )
}

export default PokeDexEntry