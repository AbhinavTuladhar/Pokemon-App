import React from 'react'
import SectionTitle from '../../components/SectionTitle'
import TableContainer from '../../components/TableContainer'
import { languageNameMapping } from '../../utils/languageNameMapping'

const customOrder = {
  'English': 1,
  'Japanese': 2,
  'German': 3,
  'French': 4,
  'Italian': 5,
  'Spanish': 6,
  'Korean': 7,
  'Chinese (Simplified)': 8,
  'Chinese (Traditional)': 9
}

// For expanding the language name and then re-ordering the objects in the array in a very specific order as mentioned above.
function processLanuages(arr) {
  const validLanguages = Object.keys(languageNameMapping)
  const filteredLanguages = arr.filter(obj => validLanguages.includes(obj.languageName))
  const properLanguages = filteredLanguages.map(obj => {
    return { ...obj, languageName: languageNameMapping[obj.languageName] }
  })
  return properLanguages.sort((a, b) => customOrder[a.languageName] - customOrder[b.languageName])
}

const OtherLanguages = ({ data }) => {
  const { names, genera } = data

  let languagesList = names.map(obj => {
    const { language: { name: languageName }, name: pokemonName } = obj
    return { languageName, pokemonName }
  })

  let generaList = genera.map(obj => {
    const { language: { name: languageName }, genus: genusName } = obj
    return { languageName, genusName }
  })

  languagesList = processLanuages(languagesList)
  generaList = processLanuages(generaList)

  const nameRows = languagesList.map((row, index) => {
    return (
      <div className='table-row border-t border-gray-200 h-12'>
        <div className='w-2/5 border-t align-middle border-gray-200 table-cell text-right font-thin'>
          {row.languageName}
        </div>
        <div className='border-t align-middle border-gray-200 table-cell pl-4'>
          {row.pokemonName}
        </div>
      </div>
    )
  })

  const genusRows = generaList.map((row, index) => {
    return (
      <div className='table-row border-t border-gray-200 h-12 w-screen'>
        <div className='w-2/5 border-t align-middle border-gray-200 table-cell text-right font-thin'>
          {row.languageName}
        </div>
        <div className='border-t align-middle border-gray-200 table-cell pl-4'>
          {row.genusName}
        </div>
      </div>
    )
  })

  return (
    <>
      <SectionTitle text='Other languages' />
      <div className='flex flex-row flex-wrap gap-10'>
        <div className='table border-b border-gray-200 flex-1 min-w-full md:min-w-fit'>
          {nameRows}
        </div>

        <div className='table border-b border-gray-200 flex-1 min-w-full md:min-w-fit '>
          {genusRows}
        </div>
      </div>
    </>
  )
}

export default OtherLanguages