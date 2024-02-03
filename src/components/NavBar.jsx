import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'

const ListItem = ({ items, closeMenu, subMenuFlag }) => {
  return items.map((data, index) => (
    <li
      className={`float-left min-h-full w-full flex-1 ${subMenuFlag && 'w-full'}`}
      onClick={closeMenu}
      key={index}
    >
      <NavLink to={data.path}>
        <span
          className={`block w-full bg-gray-800 px-2 text-center text-white duration-300 hover:brightness-125 ${subMenuFlag ? 'bg-black py-3' : 'py-4'}`}
        >
          {data.name}
        </span>
      </NavLink>
    </li>
  ))
}

const DropDownMenu = ({ menuData, parentText }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    // setIsMenuOpen(prevState => !prevState)
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const openMenu = () => {
    setIsMenuOpen(true)
  }

  const navElements = <ListItem items={menuData} closeMenu={closeMenu} subMenuFlag={true} />

  return (
    <li
      className="float-left flex-1"
      onMouseOver={openMenu}
      onMouseOut={closeMenu}
      onClick={toggleMenu}
    >
      <div className="group relative">
        <button className="block w-full whitespace-nowrap bg-gray-800 px-2 py-4 text-center text-white duration-300 hover:brightness-125">
          <span> {parentText} </span>
          <span className="text-yellow-400">▼</span>
        </button>
        <ul
          className={`absolute z-10 ${
            isMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
          } w-full text-center text-white transition-opacity duration-300`}
          onClick={closeMenu}
        >
          {navElements}
        </ul>
      </div>
    </li>
  )
}

const NavBar = () => {
  const linkData = [
    { path: '/pokemon/generation-1', name: 'Gen 1' },
    { path: '/pokemon/generation-2', name: 'Gen 2' },
    { path: '/pokemon/generation-3', name: 'Gen 3' },
    { path: '/pokemon/generation-4', name: 'Gen 4' },
    { path: '/pokemon/generation-5', name: 'Gen 5' },
    { path: '/pokemon/generation-6', name: 'Gen 6' },
    { path: '/pokemon/generation-7', name: 'Gen 7' },
    { path: '/pokemon/forms', name: 'Forms' },
    { path: '/moves', name: 'Moves' },
    { path: '/ability', name: 'Abilities' },
    { path: '/berry', name: 'Berries' },
    { path: '/egg-group', name: 'Egg groups' },
    { path: '/natures', name: 'Natures' },
    { path: '/types', name: 'Types' },
    { path: '/location', name: 'Locations' },
  ]

  return (
    <section className="mb-4">
      <div className="flex flex-wrap justify-center bg-gradient-to-t from-slate-900 to-slate-800 p-2 text-center text-5xl font-semibold tracking-tight lg:text-6xl lg:font-bold">
        <NavLink to="/" className="text-sky-500">
          {' '}
          Pokémon Database{' '}
        </NavLink>
      </div>
      <nav>
        <ul className="flex list-none flex-wrap">
          <DropDownMenu parentText="Pokédex" menuData={linkData.slice(0, 8)} />
          <DropDownMenu parentText="Lists" menuData={linkData.slice(8, 13)} />
          <ListItem items={linkData.slice(13)} subMenuFlag={false} />
        </ul>
      </nav>
    </section>
  )
}

export default NavBar
