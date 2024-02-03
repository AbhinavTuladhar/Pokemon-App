import React from 'react'
import TableContainer from '../../components/TableContainer'
import TabularSkeleton from '../../components/TabularSkeleton'
import SectionTitle from '../../components/SectionTitle'
import formatName from '../../utils/NameFormatting'

const GameDescription = ({ descriptions }) => {
  // The objective is to group by generation, but display the game names.
  /*
  { descritpion, version, generation } is the structure of the object.
  */
  const groupedData = descriptions?.reduce((acc, curr) => {
    const { description: rawDescription, generation, version } = curr
    // There are escape characters in the descriptions, which shall now be removed.
    const description = rawDescription?.replace(/\n/g, ' ')
    if (!acc[generation]) {
      acc[generation] = {
        description,
        generation,
        version: [version],
      }
      // Games in the same generation may have different descriptions. So another key is allocated here
    } else if (acc[generation].description !== description) {
      const newGeneration = `${generation}_new`
      acc[newGeneration] = {
        description,
        generation: newGeneration,
        version: [version],
      }
    } else {
      acc[generation].version.push(version)
    }
    return acc
  }, {})
  // Filter out undefined generations
  const properGroupedData = descriptions
    ? Object?.values(groupedData).filter((row) => row.generation !== undefined)
    : []

  const tableRows = properGroupedData?.map((row, rowIndex) => {
    return (
      <div className="table-row" key={rowIndex}>
        <div className="table-cell px-4 py-2 h-12 border-t border-slate-200 align-middle text-right">
          <ul>
            {row?.version?.map((version, index) => {
              return (
                <li className="list-none" key={index}>
                  {' '}
                  {formatName(version)}{' '}
                </li>
              )
            })}
          </ul>
        </div>
        <div className="table-cell px-4 py-2 h-12 border-t border-slate-200 align-middle">
          {row?.description}
        </div>
      </div>
    )
  })

  return (
    <>
      <SectionTitle text={'Game Descriptions'} />
      {descriptions?.length > 0 ? <TableContainer child={tableRows} /> : <TabularSkeleton />}
    </>
  )
}

export default GameDescription
