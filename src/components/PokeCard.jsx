import { React } from 'react';
import { NavLink } from 'react-router-dom'
import TypeCard from './TypeCard';

const PokeCard = ({ data }) => {
  const {
    id,
    name,
    types,
    sprites: { other : { 'official-artwork' : { front_default }}}
  } = data

  // For capitalising the first letter.
  const properName = name.charAt(0).toUpperCase() + name.slice(1);

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

  return (
    <div className='border border-slate-200 flex flex-col justify-center items-center w-full smmd:w-2/12 sm:w-1/3 md:w-1/4 mx-1 py-2'>
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