import React from 'react'

const PokeDexEntry = ( { data }) => {
  if (!Array.isArray(data)) return null

  // Let's find all the English entries first.
  const englishEntries = data.filter(entry => entry.language.name === 'en')
  console.log(englishEntries)
  
  const englishInfo = englishEntries.map(entry => {
    const rawText = entry.flavor_text
    const cleanedStr = rawText.replace(/\\n|\\r/g, '');
    const versionName = entry.version.name
    const properVersionName = versionName.charAt(0).toUpperCase() + versionName.slice(1)
    return (
      <div> 
        <span className='font-bold'> {properVersionName} </span> - {cleanedStr} 
      </div>
    )
  })

  return (
    <div>
      <h1 className='text-xl font-bold'> Pokedex Entries </h1>
      {englishInfo}
    </div>
  )
}

export default PokeDexEntry