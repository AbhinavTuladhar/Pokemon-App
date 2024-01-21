import React from 'react'
import { motion } from 'framer-motion'
import formatName from '../utils/NameFormatting'
import MoveListingSkeleton from '../components/MoveListingSkeleton'
import { NavLink } from 'react-router-dom'
import useEggGroupList from '../hooks/useEggGroupList'

const TableRow = ({ children, extraClassName }) => {
  return <div className={`${extraClassName} table-row border-t border-gray-200 h-12`}>{children}</div>
}

const LeftCell = ({ children }) => {
  return <div className="table-cell w-2/5 pl-4 align-middle border-t border-gray-200">{children}</div>
}

const RightCell = ({ children }) => {
  return <div className="table-cell pr-4 text-right align-middle border-t border-gray-200">{children}</div>
}

const EggGroupListing = () => {
  const { groupPokemonCount, isLoading } = useEggGroupList()

  const headerRow = (
    <TableRow extraClassName="font-bold bg-[#1a1a1a]">
      <LeftCell>Name</LeftCell>
      <RightCell>Pokemon</RightCell>
    </TableRow>
  )

  const eggRows = groupPokemonCount?.map((row, index) => (
    <TableRow key={index}>
      <LeftCell>
        <NavLink to={`/egg-group/${row.eggGroup}`} className="font-bold hoverable-link">
          {formatName(row.eggGroup)}
        </NavLink>
      </LeftCell>
      <RightCell>{row.pokemonCount}</RightCell>
    </TableRow>
  ))

  document.title = 'Pokémon egg groups | Pokémon database'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transitionDuration: '0.8s' }}
      exit={{ opacity: 0, transitionDuration: '0.75s' }}
      className="flex flex-col items-center justify-center pb-4"
    >
      <h1 className="mb-5 text-3xl font-bold">Egg groups</h1>
      {isLoading ? (
        <div className="w-5/12">
          <MoveListingSkeleton rowCount={10} />
        </div>
      ) : (
        <div className="table border-b border-gray-200">
          {headerRow}
          {eggRows}
        </div>
      )}
    </motion.div>
  )
}

export default EggGroupListing
