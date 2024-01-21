import React from 'react'
import { NavLink } from 'react-router-dom'
import SectionTitle from '../../components/SectionTitle'
import formatName from '../../utils/NameFormatting'

const PokemonVarieties = ({ data }) => {
  const { pokemonName, varieties } = data

  // Filter out gen 8+ forms
  const varietiesFiltered = varieties.filter((form) => {
    const {
      pokemon: { url: pokemonUrl },
    } = form
    const idNumber = pokemonUrl.match(/\/(\d+)\/$/)[1]
    return idNumber <= 10157
  })

  // Pokemon with no other forms have a variety length of just 1.
  if (varietiesFiltered.length <= 1) {
    return
  }

  // Construct a list of all the forms.
  const formsArray = varietiesFiltered.map((form, index) => {
    const {
      pokemon: { name: formName },
    } = form
    const localUrl = `/pokemon/${formName}/`
    return (
      <li key={index}>
        <NavLink to={localUrl} className="hoverable-link">
          {formatName(formName)}
        </NavLink>
      </li>
    )
  })

  return (
    <>
      <SectionTitle text={`${formatName(pokemonName)} has some other forms:`} />
      <ul className="list-disc list-inside">{formsArray}</ul>
    </>
  )
}

export default PokemonVarieties
