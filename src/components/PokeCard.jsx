import { React } from 'react';
import { NavLink } from 'react-router-dom'
import TypeCard from './TypeCard';
import formatName from '../utils/NameFormatting';
import typeMapping from '../utils/typeMapping';
import { extractPokemonInformation } from '../utils/extractInfo';

const darkenColour = colour => {
  // First check if the colour is the custom colour, ie grey-Yellow.
  const colourName = colour.slice(0, -3)
  const colourShade = parseInt(colour.slice(-3))
  const darkerShade = colourShade + 200
  const finalShade = darkerShade > 950 ? 950 : darkerShade
  const finalColour = `to-${colourName}${finalShade}`
  return finalColour
}

const PokeCard = ({ data }) => {
  const {
    id,
    name,
    types,
    front_default: defaultSprite
  } = extractPokemonInformation(data)

  // For capitalising the first letter.
  const properName = formatName(name)

  // Get a list of all the types of the Pokemon.
  let typeList = types.map(type => {
    return type.type.name
  })

  // Now map each type to its corresponding type card.
  const typeDivs = typeList.map(type => {
    return <TypeCard typeName={type} />
  })

  // When the user clickso n the Pokemon name, they are brought to the detail page.
  const targetLink = `/pokemon/${id}`

  // Apply a background gardient to the card depending on the types.
  const [firstType, secondType] = typeList
  const [firstColour, secondColour] = [typeMapping[firstType], typeMapping[secondType]]
  const startingColour = `from-${firstColour}`

  // Now do some complicated shenanigans to use a one-step darker shade as the stopping colour for mono-type pokemon 
  const endingColour = secondType === undefined ? darkenColour(firstColour) : `to-${secondColour}`
  const gradientStyle = `bg-gradient-to-tr from-10% to-90% ${startingColour} ${endingColour}`

  return (
    <div className={`${gradientStyle} rounded-xl flex flex-col justify-center items-center w-full hover:scale-105 hover:shadow-xl hover:shadow-blue-400 hover:drop-shadow-lg duration-200`}>
      <div className='font-bold'>
        #{id}
      </div>
      <NavLink to={targetLink} className='font-extrabold text-xl'>
        {properName}
      </NavLink>
      <div>
        <img src={defaultSprite} className='h-[100px]' alt={name} />
      </div>
      <div className='flex flex-row mt-4 mb-2'>
        {typeDivs}
      </div>
    </div>
  )
}

export default PokeCard;