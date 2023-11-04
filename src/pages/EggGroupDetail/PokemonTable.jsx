import React from 'react'
import { NavLink } from 'react-router-dom'
import TypeCard from '../../components/TypeCard'
import formatName from '../../utils/NameFormatting'
import { motion } from 'framer-motion'

const PokemonTable = ({ data }) => {
  const headerNames = ['#', 'Name', 'Type', 'Other group']
  const tableHeaders = headerNames.map(header => (
    <div className='h-12 bg-[#1a1a1a] table-cell px-4 py-2 border-t-[1px] font-bold border-slate-200 align-middle'>
      {header}
    </div>
  ))

  const tableRows = data?.map(entry => {
    const { nationalNumber, icon, name, types, otherEggGroup } = entry
    const properId = `${'00' + nationalNumber}`.slice(-3)

    const cellData = [
      {
        value: (
          <div className='flex flex-row gap-x-4 items-center'>
            <span className='align-middle'> {properId} </span>
            <img src={icon} alt={name} className='w-[56px]' />
          </div>
        )
      }, {
        value: (
          <NavLink to={`/pokemon/${name}`} className='hoverable-link font-bold'> {formatName(name)} </NavLink>
        )
      }, {
        value: (
          <div className='flex flex-col gap-y-2'>
            {types.map(type => <TypeCard typeName={type.type.name} />)}
          </div>
        )
      },
      {
        value: (
          <span>
            {otherEggGroup && (
              <NavLink to={`/egg-group/${otherEggGroup}`} className='hoverable-link font-bold'>
                {formatName(otherEggGroup)}
              </NavLink>
            )}
          </span>
        )
      }
    ]

    const tableCells = cellData.map(cell => (
      <div className='h-12 table-cell px-4 py-2 border-t-[1px] border-slate-200 align-middle'>
        {cell.value}
      </div>
    ))

    return (
      <div className='table-row'>
        {tableCells}
      </div>
    )

  })
  return (
    <motion.div
      className='table self-start border-b border-slate-200'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transitionDuration: '0.8s' }}
      exit={{ opacity: 0, transitionDuration: '0.75s' }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      {tableHeaders}
      {tableRows}
    </motion.div>
  )
}

export default PokemonTable