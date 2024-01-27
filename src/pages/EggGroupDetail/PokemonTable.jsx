import React from 'react'
import { NavLink } from 'react-router-dom'
import TypeCard from '../../components/TypeCard'
import formatName from '../../utils/NameFormatting'
import { motion } from 'framer-motion'
import MoveListingSkeleton from '../../components/MoveListingSkeleton'
import TableContainer from '../../components/TableContainer'

const PokemonTable = ({ data, isLoading }) => {
  const headerNames = ['#', 'Name', 'Type', 'Other group']
  const tableHeaders = headerNames.map((header) => (
    <div className="h-12 bg-[#1a1a1a] table-cell px-4 py-2 border-t font-bold border-slate-200 align-middle">
      {header}
    </div>
  ))

  const tableRows = data?.map((entry, rowIndex) => {
    const { nationalNumber, icon, name, types, otherEggGroup } = entry
    const properId = `${'00' + nationalNumber}`.slice(-3)

    const cellData = [
      {
        value: (
          <div className="flex flex-row items-center gap-x-2">
            <span className="align-middle"> {properId} </span>
            <img src={icon} alt={name} className="w-[64px]" />
          </div>
        ),
      },
      {
        value: (
          <NavLink to={`/pokemon/${name}`} className="font-bold hoverable-link">
            {' '}
            {formatName(name)}{' '}
          </NavLink>
        ),
      },
      {
        value: (
          <div className="flex flex-col gap-y-2">
            {types.map((type, index) => (
              <TypeCard typeName={type.type.name} key={index} />
            ))}
          </div>
        ),
      },
      {
        value: (
          <span>
            {otherEggGroup && (
              <NavLink to={`/egg-group/${otherEggGroup}`} className="font-bold hoverable-link">
                {formatName(otherEggGroup)}
              </NavLink>
            )}
          </span>
        ),
      },
    ]

    const tableCells = cellData.map((cell, cellIndex) => (
      <td
        className="min-w-[5rem] table-cell h-12 px-4 py-2 mx-4 align-middle border-t border-slate-200"
        key={cellIndex}
      >
        {cell.value}
      </td>
    ))

    return (
      <tr className="table-row" key={rowIndex}>
        {tableCells}
      </tr>
    )
  })

  const tableData = (
    <>
      <div className="table-row">{tableHeaders}</div>
      {tableRows}
    </>
  )

  return (
    <motion.div
      className="self-start"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transitionDuration: '0.8s' }}
      exit={{ opacity: 0, transitionDuration: '0.75s' }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      {!isLoading ? <TableContainer child={tableData} /> : <MoveListingSkeleton rowCount={10} />}
    </motion.div>
  )
}

export default PokemonTable
