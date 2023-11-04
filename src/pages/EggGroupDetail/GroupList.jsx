import React from 'react'
import fetchData from '../../utils/fetchData'
import { useQuery } from 'react-query'
import { extractEggGroupInformation } from '../../utils/extractInfo'
import SectionTitle from '../../components/SectionTitle'
import { NavLink } from 'react-router-dom'
import formatName from '../../utils/NameFormatting'
import MoveListingSkeleton from '../../components/MoveListingSkeleton'

const GroupList = () => {
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
  return (
    <section className='bg-[#19272d] px-4 flex flex-col pb-4 self-start rounded'>
      {isLoadingListData ? (
        <MoveListingSkeleton rowCount={20} />
      ) : (
        <>
          <SectionTitle text='Egg Groups' />
          <ul className='list-disc list-inside'>
            {groupPokemonCount?.map((group, index) => {
              const { eggGroup, pokemonCount } = group
              return (
                <li key={index}>
                  <NavLink to={`/egg-group/${eggGroup}`} className='hoverable-link font-normal'>
                    {formatName(eggGroup)}
                  </NavLink>
                  <span> {`(${pokemonCount})`}</span>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </section>
  )
}

export default GroupList