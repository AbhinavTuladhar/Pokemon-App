import { React } from 'react'
import { NavLink } from 'react-router-dom'
import TypeCard from './TypeCard'
import formatName from '../utils/NameFormatting'
import typeMapping from '../utils/typeMapping'
import { extractPokemonInformation } from '../utils/extractInfo'

const darkenColour = (colour) => {
  if (!colour) return

  // First check if the colour is the custom colour, ie grey-Yellow.
  const colourName = colour.slice(0, -3)
  const colourShade = parseInt(colour.slice(-3))
  const darkerShade = colourShade + 200
  const finalShade = darkerShade > 950 ? 950 : darkerShade
  const finalColour = `to-${colourName}${finalShade}`
  return finalColour
}

const PokeCard = ({ data }) => {
  const { id, name, types, front_default: defaultSprite } = extractPokemonInformation(data) || {}

  // For capitalising the first letter.
  const properName = formatName(name)

  // Get a list of all the types of the Pokemon.
  let typeList = types?.map((type) => {
    return type.type.name
  })

  // Now map each type to its corresponding type card.
  const typeDivs = typeList?.map((type, index) => {
    return <TypeCard typeName={type} key={index} />
  })

  // When the user clicks on the Pokemon name, they are brought to the detail page.
  const targetLink = `/pokemon/${name}`

  // Apply a background gardient to the card depending on the types.
  const [firstType, secondType] = typeList || []
  const [firstColour, secondColour] = [typeMapping[firstType], typeMapping[secondType]]
  const startingColour = `from-${firstColour}`

  // Now do some complicated shenanigans to use a one-step darker shade as the stopping colour for mono-type pokemon
  const endingColour = secondType === undefined ? darkenColour(firstColour) : `to-${secondColour}`
  const gradientStyle = `bg-gradient-to-tr from-10% to-90% ${startingColour} ${endingColour}`

  return (
    <div
      className={`${gradientStyle} flex w-48 flex-col items-center justify-center rounded-xl p-2 duration-200 hover:scale-105 hover:shadow-xl hover:shadow-blue-400 hover:drop-shadow-lg sm:w-56`}
    >
      <div className="font-bold">#{id}</div>
      <NavLink to={targetLink} className="text-center text-xl font-extrabold">
        {properName}
      </NavLink>
      <div>
        <img src={defaultSprite} className="h-[100px]" alt={name} />
      </div>
      <div className="mb-2 mt-4 flex flex-row">{typeDivs}</div>
    </div>
  )
}

export default PokeCard
