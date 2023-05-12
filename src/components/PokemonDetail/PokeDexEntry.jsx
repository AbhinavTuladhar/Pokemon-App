import React from 'react'

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

  const entryRows = englishInfo.map((entry, i) => {
    return (
      <div className='flex flex-row border-t-[1px] border-gray-200 py-2'>
        <div className='flex justify-end items-center w-2/12 text-right'> {entry.versionName} </div>
        <div className='flex justify-start pl-4 w-10/12'> {entry.description} </div>
      </div>
    )
  })

  return (
    <>
      <div className='font-bold text-3xl mb-10'> Pokédex Entry </div>
      <div className='flex flex-col border-b-[1px] border-gray-200'>
        {entryRows}
      </div>
    </>
  )
}

export default PokeDexEntry