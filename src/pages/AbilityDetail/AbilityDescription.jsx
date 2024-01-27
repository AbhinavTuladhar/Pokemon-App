import React from 'react'
import SectionTitle from '../../components/SectionTitle'
import TableContainer from '../../components/TableContainer'
import TabularSkeleton from '../../components/TabularSkeleton'
import formatName from '../../utils/NameFormatting'

const AbilityDescription = ({ descriptions }) => {
  const groupedData = descriptions?.reduce((acc, curr) => {
    const { description: rawDescription, generation, versionName } = curr
    // There are escape characters in the descriptions, which shall now be removed.
    const description = rawDescription?.replace(/\n/g, ' ')
    if (!acc[generation]) {
      acc[generation] = {
        description,
        generation,
        versionName: [versionName],
      }
      // Games in the same generation may have different descriptions. So another key is allocated here
      // } else if (acc[generation].description !== description) {
      //   const newGeneration = `${generation}_new`
      //   acc[newGeneration] = {
      //     description, generation: newGeneration, versionName: [versionName]
      //   }
    } else {
      acc[generation].versionName.push(versionName)
    }
    return acc
  }, {})

  // Filter out undefined generations
  const properGroupedData = descriptions
    ? Object?.values(groupedData).filter((row) => row.generation !== undefined)
    : []

  const tableRows = properGroupedData?.map((row, rowIndex) => {
    return (
      <tr className="table-row" key={rowIndex}>
        <td className="table-cell px-4 py-2 h-12 border-t border-slate-200 align-middle text-right">
          <ul>
            {row?.versionName?.map((version) => {
              return (
                <li className="list-none" key={version}>
                  {' '}
                  {formatName(version)}{' '}
                </li>
              )
            })}
          </ul>
        </td>
        <div className="table-cell px-4 py-2 h-12 border-t border-slate-200 align-middle">{row?.description}</div>
      </tr>
    )
  })

  return (
    <>
      <SectionTitle text={'Game Descriptions'} />
      {descriptions ? <TableContainer child={tableRows} /> : <TabularSkeleton />}
    </>
  )
}

export default AbilityDescription
