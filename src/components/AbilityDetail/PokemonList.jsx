import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useQuery } from 'react-query'
import { NavLink } from 'react-router-dom'
import SectionTitle from '../SectionTitle'
import TableContainer from '../TableContainer'
import formatName from '../../utils/NameFormatting'
import { extractPokemonInformation } from '../../utils/extractInfo'

const PokemonList = ({ data }) => {
  const { pokemonList, name: abilityName } = data
  const [readyInformation, setReadyInformation] = useState([])

  const urlList = pokemonList?.map(pokemon => pokemon.pokemon.url)

  // We now need to query the Pokemon URLs in order to find their icons, and other abilities
  const fetchPokemonData = async (url) => {
    const response = await axios.get(url)
    return response.data
  }

  const { data: pokemonData } = useQuery(
    ['abilityData', pokemonList],
    () => Promise.all(urlList?.map(fetchPokemonData)),
    { staleTime: Infinity, cacheTime: Infinity, retry: 3 },
  )

  useEffect(() => {
    if (!pokemonData)
      return
    // We now need to find the pokemon name, the icons, and the other abilities of the pokemon.
    const rawInformation = pokemonData?.map(pokemon => {
      const { abilities, name, icon, id } = extractPokemonInformation(pokemon)
      // Now find the other abilities of the Pokemon. THese pokemon should have an icon.
      const otherAbilities = abilities?.filter(ability => ability.ability.name !== abilityName)
        ?.map(ability => ability.ability.name)
      return {
        id,
        name,
        otherAbilities,
        icon
      }
    })
    setReadyInformation(rawInformation?.filter(entry => entry.icon !== null))
  }, [pokemonData, abilityName])

  const headers = [{
    id: '#',
    name: 'Name',
    otherAbilities: 'Other abilities'
  }]

  const rowData = [...headers, ...readyInformation]?.map((pokemon, index) => {
    const { id, icon, name, otherAbilities } = pokemon
    const cellData = [
      { 
        key: 'id', 
        value: (
        <div className='flex items-center'>
          <span> { id } </span> 
          {index > 0 && <img src={icon} alt={name} className='w-[80px]' />}
        </div>
      )},
      {
        key: 'pokemonName',
        value: (
          <NavLink to={`/pokemon/${id}`} className={index > 0 && 'text-blue-500 font-bold hover:text-red-500 hover:underline duration-300'}> 
            { name } 
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
          otherAbilities.map(ability => (<> {formatName(ability)} <br /> </>))
          :
          '—'
        ) 
        : 
        otherAbilities
      }
    ]

    const tableCells = cellData?.map((cell, cellIndex) => {
      return (
        <div className={`table-cell px-4 py-2 h-12 border-t-[1px] border-slate-200 align-middle ${(index === 0 && cellIndex !== cellData.length - 1) && 'border-r-[1px]'} ${index === 0 && 'bg-gray-900 font-bold'}`}>
          { cell.value }
        </div>
      )
    })

    return (
      <div className='table-row'> 
        { tableCells }
      </div>
    )
  })

  return (
    <>
      <SectionTitle text={`Pokemon with ${formatName(abilityName)}`} />
      <TableContainer child={rowData} />
      {/* <>
        {pokemonList?.map(pokemon => (<> {pokemon.pokemon.name} <br/> </>))}
      </> */}
    </>
  )
}

export default PokemonList