import React from 'react'
import SectionTitle from '../../components/SectionTitle'
import { languageNameMapping } from '../../utils/languageNameMapping'

const customOrder = {
  English: 1,
  Japanese: 2,
  German: 3,
  French: 4,
  Italian: 5,
  Spanish: 6,
  Korean: 7,
  'Chinese (Simplified)': 8,
  'Chinese (Traditional)': 9,
}

// For expanding the language name and then re-ordering the objects in the array in a very specific order as mentioned above.
function processLanuages(arr) {
  const validLanguages = Object.keys(languageNameMapping)
  const filteredLanguages = arr.filter((obj) => validLanguages.includes(obj.languageName))
  const properLanguages = filteredLanguages.map((obj) => {
    return { ...obj, languageName: languageNameMapping[obj.languageName] }
  })
  return properLanguages.sort((a, b) => customOrder[a.languageName] - customOrder[b.languageName])
}

const LanguageCell = ({ children }) => {
  return (
    <div className="table-cell w-2/5 border-t border-gray-200 text-right align-middle font-thin">
      {children}
    </div>
  )
}

const NameCell = ({ children }) => {
  return <div className="table-cell border-t border-gray-200 pl-4 align-middle">{children}</div>
}

const OtherLanguages = ({ data }) => {
  const { names, genera } = data

  let languagesList = names.map((obj) => {
    const {
      language: { name: languageName },
      name: pokemonName,
    } = obj
    return { languageName, pokemonName }
  })

  let generaList = genera.map((obj) => {
    const {
      language: { name: languageName },
      genus: genusName,
    } = obj
    return { languageName, genusName }
  })

  languagesList = processLanuages(languagesList)
  generaList = processLanuages(generaList)

  const nameRows = languagesList.map((row, index) => {
    return (
      <div className="table-row h-12 border-t border-gray-200" key={index}>
        <LanguageCell>{row.languageName}</LanguageCell>
        <NameCell>{row.pokemonName}</NameCell>
      </div>
    )
  })

  const genusRows = generaList.map((row, index) => {
    return (
      <div className="table-row h-12 w-screen border-t border-gray-200" key={index}>
        <LanguageCell>{row.languageName}</LanguageCell>
        <NameCell>{row.genusName}</NameCell>
      </div>
    )
  })

  return (
    <>
      <SectionTitle text="Other languages" />
      <div className="grid grid-cols-2-flexible gap-x-10 gap-y-16">
        <div className="table min-w-full flex-1 border-b border-gray-200 md:min-w-fit">
          {nameRows}
        </div>

        <div className="table min-w-full flex-1 border-b border-gray-200 md:min-w-fit ">
          {genusRows}
        </div>
      </div>
    </>
  )
}

export default OtherLanguages
