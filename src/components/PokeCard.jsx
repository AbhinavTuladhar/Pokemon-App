import { React } from 'react';
import { NavLink } from 'react-router-dom'
import TypeCard from './TypeCard';
import formatName from '../utils/NameFormatting';
import typeMapping from '../utils/typeMapping';

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
    sprites: { other : { 'official-artwork' : { front_default }}}
  } = data

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
  const gradientStyle = `${startingColour} ${endingColour}`

  return (
    <div className={`${gradientStyle} bg-gradient-to-tr rounded-xl flex flex-col justify-center items-center w-full smmd:w-2/12 sm:w-1/3 md:w-1/4 m-4 py-2`}>
      <div className='font-bold'>
        #{id}
      </div>
      <NavLink to={targetLink} className='font-extrabold text-xl'>
        {properName}
      </NavLink>
      <div>
        <img src={front_default} className='h-[100px]' alt={name} />
      </div>
      <div className='flex flex-row mt-4 mb-2'>
        {typeDivs}
      </div>
    </div>
  )
}

export default PokeCard;