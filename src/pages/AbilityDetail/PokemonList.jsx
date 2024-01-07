import React from 'react'
import { useQueries } from '@tanstack/react-query'
import { NavLink } from 'react-router-dom'
import Skeleton from 'react-loading-skeleton'
import SectionTitle from '../../components/SectionTitle'
import TableContainer from '../../components/TableContainer'
import TabularSkeleton from '../../components/TabularSkeleton'
import formatName from '../../utils/NameFormatting'
import { extractPokemonInformation } from '../../utils/extractInfo'
import fetchData from '../../utils/fetchData'
import '../../index.css'

const PokemonList = ({ data }) => {
  const { pokemonList, name: abilityName } = data
  const urlList = pokemonList?.map(pokemon => pokemon.pokemon.url)

  // We now need to query the Pokemon URLs in order to find their icons, and other abilities
  const { data: readyInformation = [], isLoading } = useQueries({
    queries: urlList
      ? urlList.map(url => {
        return {
          queryKey: ['pokemon-url', url],
          queryFn: () => fetchData(url),
          staleTime: Infinity,
          cacheTime: Infinity,
          select: data => {
            // We now need to find the pokemon name, the icons, and the other abilities of the pokemon.
            const { abilities, name, icon, id, order, nationalNumber } = extractPokemonInformation(data)
            // Now find the other abilities of the Pokemon. THese pokemon should have an icon.
            const otherAbilities = abilities?.filter(ability => ability.ability.name !== abilityName)
              ?.map(ability => ability.ability.name)
            return {
              id,
              name,
              otherAbilities,
              icon,
              order,
              nationalNumber
            }
          }
        }
      })
      : [],
    combine: results => {
      return {
        data: results.map(result => result.data)
          ?.filter(entry => (entry?.id >= 1 && entry?.id <= 807) || (entry?.id >= 10001 && entry?.id <= 10157))
          ?.sort((prev, curr) => prev?.nationalNumber >= curr?.nationalNumber ? 1 : -1),
        isLoading: results.some(result => result.isLoading),
      }
    },
  })

  const headers = [{
    id: '#',
    name: 'Name',
    otherAbilities: 'Other abilities'
  }]

  const rowData = [...headers, ...readyInformation]?.map((pokemon, index) => {
    const { id, icon, name, otherAbilities, nationalNumber } = pokemon
    // Pad the nationalNumber
    const properId = `${'00' + nationalNumber}`.slice(-3)
    const cellData = [
      {
        key: 'id',
        value: (
          <div className='flex items-center'>
            <span> {index !== 0 ? properId : id} </span>
            {index > 0 && <img src={icon} alt={name} className='w-[56px]' />}
          </div>
        ),
        style: 'w-32'
      },
      {
        key: 'pokemonName',
        value: (
          <NavLink to={`/pokemon/${name}`} className={index > 0 && 'font-bold hoverable-link'}>
            {formatName(name)}
          </NavLink>
        )
      },
      {
        key: 'ability',
        value: index !== 0
          ?
          (
            otherAbilities.length > 0
              ?
              otherAbilities.map((ability, index) =>
              (<span key={index}>
                <NavLink to={`/ability/${ability}`} className='hoverable-link'> {formatName(ability)} </NavLink> <br />
              </span>)
              )
              :
              '—'
          )
          :
          otherAbilities
      }
    ]

    const tableCells = cellData?.map((cell, cellIndex) => {
      return (
        <div className={`${cell?.style} min-w-[10rem] table-cell px-4 py-2 h-12 border-t border-slate-200 align-middle ${(index === 0 && cellIndex !== cellData.length - 1) && 'border-r'} ${index === 0 && 'bg-gray-900 font-bold'}`} key={cellIndex}>
          {cell.value}
        </div>
      )
    })

    return (
      <div className='table-row' key={index}>
        {tableCells}
      </div>
    )
  })

  return (
    <>
      {(isLoading || !abilityName) ? (
        <div className='flex flex-col gap-y-2 mt-5'>
          <Skeleton width='90%' height='3rem' containerClassName='flex-1 w-full' />
          <TabularSkeleton />
        </div>
      ) : (
        <>
          <SectionTitle text={`Pokemon with ${formatName(abilityName)}`} />
          <TableContainer child={rowData} />
        </>
      )}
    </>
  )
}

export default PokemonList