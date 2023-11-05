import React from 'react'
import { motion } from 'framer-motion'
import formatName from '../utils/NameFormatting'
import MoveListingSkeleton from '../components/MoveListingSkeleton'
import { NavLink } from 'react-router-dom'
import useEggGroupList from '../hooks/useEggGroupList'

const TableRow = ({ children, extraClassName }) => {
  return (
    <div className={`${extraClassName} table-row border-t border-gray-200 h-12`}>
      {children}
    </div>
  )
}

const LeftCell = ({ children }) => {
  return (
    <div className='w-2/5 border-t align-middle border-gray-200 table-cell pl-4'>
      {children}
    </div>
  )
}

const RightCell = ({ children }) => {
  return (
    <div className='border-t align-middle border-gray-200 table-cell text-right pr-4'>
      {children}
    </div>
  )
}

const EggGroupListing = () => {
  const { groupPokemonCount, isLoading } = useEggGroupList()

  const headerRow = (
    <TableRow extraClassName='font-bold bg-[#1a1a1a]'>
      <LeftCell>
        Name
      </LeftCell>
      <RightCell>
        Pokemon
      </RightCell>
    </TableRow>
  )

  const eggRows = groupPokemonCount?.map(row => (
    <TableRow>
      <LeftCell>
        <NavLink to={`/egg-group/${row.eggGroup}`} className='hoverable-link font-bold'>
          {formatName(row.eggGroup)}
        </NavLink>
      </LeftCell>
      <RightCell>
        {row.pokemonCount}
      </RightCell>
    </TableRow>
  ))

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transitionDuration: '0.8s' }}
      exit={{ opacity: 0, transitionDuration: '0.75s' }}
      className='mx-4 pb-4 md:mx-10 flex flex-col justify-center items-center'
    >
      <h1 className='text-3xl font-bold mb-5'>
        Egg groups
      </h1>
      {isLoading ? (
        <div className='w-5/12'>
          <MoveListingSkeleton rowCount={10} />
        </div>
      ) : (
        <div className='table border-b border-gray-200'>
          {headerRow}
          {eggRows}
        </div>
      )
      }
    </motion.div>
  )
}

export default EggGroupListing