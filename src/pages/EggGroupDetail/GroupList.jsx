import React from 'react'
import SectionTitle from '../../components/SectionTitle'
import { NavLink } from 'react-router-dom'
import formatName from '../../utils/NameFormatting'
import MoveListingSkeleton from '../../components/MoveListingSkeleton'
import useEggGroupList from '../../hooks/useEggGroupList'

const GroupList = () => {
  const { groupPokemonCount, isLoading } = useEggGroupList()

  return (
    <section className="flex flex-col self-start rounded bg-[#19272d] px-4 pb-4">
      {isLoading ? (
        <MoveListingSkeleton rowCount={20} />
      ) : (
        <>
          <SectionTitle text="Egg Groups" />
          <ul className="list-inside list-disc">
            {groupPokemonCount?.map((group, index) => {
              const { eggGroup, pokemonCount } = group
              return (
                <li key={index}>
                  <NavLink to={`/egg-group/${eggGroup}`} className="hoverable-link font-normal">
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
