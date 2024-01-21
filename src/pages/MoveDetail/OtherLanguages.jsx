import React from 'react'
import SectionTitle from '../../components/SectionTitle'
import TableContainer from '../../components/TableContainer'
import { languageNameMapping } from '../../utils/languageNameMapping'
import TabularSkeleton from '../../components/TabularSkeleton'

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
const processLanuages = (arr) => {
  const validLanguages = Object.keys(languageNameMapping)
  const filteredLanguages = arr?.filter((obj) => validLanguages?.includes(obj.languageName))
  const properLanguages = filteredLanguages?.map((obj) => {
    return { ...obj, languageName: languageNameMapping[obj.languageName] }
  })
  return properLanguages?.sort((a, b) => customOrder[a.languageName] - customOrder[b.languageName])
}

const LanguageCell = ({ children }) => {
  return <div className="table-cell w-2/5 font-thin text-right align-middle border-t border-gray-200">{children}</div>
}

const NameCell = ({ children }) => {
  return <div className="table-cell pl-4 align-middle border-t border-gray-200">{children}</div>
}

const OtherLanguages = ({ names }) => {
  let languagesList = names?.map((obj) => {
    const {
      language: { name: languageName },
      name: moveName,
    } = obj
    return { languageName, moveName }
  })

  languagesList = processLanuages(languagesList)

  const nameRows = languagesList?.map((row, index) => {
    return (
      <div className="table-row h-12 border-t border-gray-200" key={index}>
        <LanguageCell>{row.languageName}</LanguageCell>
        <NameCell>{row.moveName}</NameCell>
      </div>
    )
  })

  return (
    <>
      <SectionTitle text="Other Languages" />
      {names?.length ? <TableContainer child={nameRows} /> : <TabularSkeleton />}
    </>
  )
}

export default OtherLanguages
