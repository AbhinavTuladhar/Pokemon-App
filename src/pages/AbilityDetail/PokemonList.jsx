import React from 'react'
import { useQuery } from 'react-query'
import { NavLink } from 'react-router-dom'
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

  // Extracting information from the API response.
  const transformData = pokemonData => {
    // We now need to find the pokemon name, the icons, and the other abilities of the pokemon.
    const rawInformation = pokemonData?.map((pokemon) => {
      const { abilities, name, icon, id, order, nationalNumber } = extractPokemonInformation(pokemon)
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
    })

    // Now sort by nationalNumber to take into account the mega evolutions and other forms.
    return (
      rawInformation
        ?.filter(entry => (entry.id >= 1 && entry.id <= 807) || (entry.id >= 10001 && entry.id <= 10157))
        ?.sort((prev, curr) => prev.nationalNumber >= curr.nationalNumber ? 1 : -1)
    )
  }

  // We now need to query the Pokemon URLs in order to find their icons, and other abilities
  const { data: readyInformation = [] } = useQuery(
    ['abilityData', pokemonList],
    () => Promise.all(urlList?.map(fetchData)),
    { staleTime: Infinity, cacheTime: Infinity, retry: 3, select: transformData },
  )

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
        <div className={`${cell?.style} table-cell px-4 py-2 h-12 border-t-[1px] border-slate-200 align-middle ${(index === 0 && cellIndex !== cellData.length - 1) && 'border-r-[1px]'} ${index === 0 && 'bg-gray-900 font-bold'}`} key={cellIndex}>
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
      {pokemonList ? (
        <>
          <SectionTitle text={`Pokemon with ${formatName(abilityName)}`} />
          <TableContainer child={rowData} />
        </>
      ) :
        <TabularSkeleton />
      }
    </>
  )
}

export default PokemonList