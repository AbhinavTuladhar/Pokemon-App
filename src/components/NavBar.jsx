import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const ListItem = ({ items, closeMenu, subMenuFlag }) => {
  return (
    items.map((data, index) => (
      <li className={`float-left min-h-full flex-1 ${subMenuFlag && 'w-full'}`} key={index}>
        <NavLink to={data.path} onClick={closeMenu}>
          <span className={`hover:brightness-125 duration-300 text-white block text-center px-2 bg-gray-800
            ${subMenuFlag ? 'py-3' : 'py-4'}`}
          > {data.name}
          </span>
        </NavLink>
      </li>
    ))
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
    { path: '/types', name: 'Types' },
    { path: '/moves', name: 'Moves' },
    { path: '/ability', name: 'Abilities' },
    { path: '/location', name: 'Locations' }
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const openMenu = () => {
    setIsMenuOpen(true);
  };

  const pokemonNavElements = <ListItem items={linkData.slice(0, 8)} closeMenu={closeMenu} subMenuFlag={true} />
  const otherNavElements = <ListItem items={linkData.slice(8)} closeMenu={closeMenu} subMenuFlag={false} />

  return (
    <section className='mb-4'>
      <div
        className='flex flex-wrap justify-center py-2 text-5xl font-semibold tracking-tight text-center bg-gradient-to-t from-slate-900 to-slate-800 lg:text-6xl lg:font-bold'
      >
        <NavLink to='/' className='text-transparent bg-gradient-to-r from-yellow-500 to-indigo-500 bg-clip-text'> Pokémon Database </NavLink>
      </div>
      <nav>
        <ul className='flex flex-wrap list-none justify-left'>
          <li className='flex-1 float-left'>
            <div
              className='relative group'
              onMouseEnter={openMenu}
              onMouseLeave={closeMenu}
              onClick={toggleMenu}
            >
              <button className='block w-full px-2 py-4 text-center text-white duration-300 bg-gray-800 whitespace-nowrap hover:brightness-125'>
                Pokédex <span className='text-yellow-400'>▼</span>
              </button>
              <ul
                className={`z-10 absolute ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  } bg-green-400 text-white text-center transition-opacity duration-500`}
                onClick={closeMenu}
              >
                {pokemonNavElements}
              </ul>
            </div>
          </li>
          {otherNavElements}
        </ul>
      </nav>
    </section>
  )
}

export default NavBar;
