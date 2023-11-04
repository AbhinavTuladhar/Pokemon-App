import React from 'react'
import fetchData from '../utils/fetchData'
import { useQuery } from 'react-query'
import { motion } from 'framer-motion'
import formatName from '../utils/NameFormatting'
import MoveListingSkeleton from '../components/MoveListingSkeleton'
import { NavLink } from 'react-router-dom'
import { extractEggGroupInformation } from '../utils/extractInfo'

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
  const { data: eggGroupData } = useQuery(
    ['egg-group'],
    () => fetchData('https://pokeapi.co/api/v2/egg-group'),
    {
      staleTime: Infinity, cacheTime: Infinity,
      select: data => {
        const { results } = data
        return results.map(group => {
          const { name, url } = group
          return { eggGroup: name, link: url }
        })
      }
    }
  )

  const urlList = eggGroupData?.map(obj => obj.link)

  // Get the number of pokemon in each egg group
  const { data: groupPokemonCount, isLoading: isLoadingListData } = useQuery(
    ['egg-group', eggGroupData],
    () => Promise.all(urlList.map(fetchData)),
    {
      staleTime: Infinity, cacheTime: Infinity,
      select: data => {
        return data.map(extractEggGroupInformation).sort((a, b) => a.eggGroup.localeCompare(b.eggGroup))
      }
    }
  )

  console.log(groupPokemonCount)

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
      {isLoadingListData ? (
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