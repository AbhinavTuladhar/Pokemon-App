import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const ListItem = ({ items, closeMenu, subMenuFlag }) => {
  return (
    items.map((data, index) => (
      <li className={`float-left min-h-full flex-1 ${subMenuFlag && 'w-full'}`} key={index}>
        <NavLink to={ data.path } onClick={closeMenu}>
          <span className={`hover:brightness-125 duration-300 text-white block text-center px-2 bg-gray-800
            ${subMenuFlag ? 'py-3' : 'py-4'}`}
          > { data.name } 
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
    <>
      <div 
        className='bg-gradient-to-t from-slate-900 to-slate-800 py-2 text-center tracking-tight flex flex-wrap justify-center text-5xl lg:text-6xl font-semibold lg:font-bold'
      >
        <NavLink to='/' className='bg-gradient-to-r from-yellow-500 to-indigo-500 text-transparent bg-clip-text'> Pokémon Database </NavLink>
      </div>
      <nav>
        <ul className='flex justify-left list-none flex-wrap'>
          <li className='float-left flex-1'>
            <div
              className='relative group'
              onMouseEnter={openMenu}
              onMouseLeave={closeMenu}
              onClick={toggleMenu}
            >
              <button className='w-full whitespace-nowrap hover:brightness-125 duration-300 text-white bg-gray-800 block text-center py-4 px-2'>
                Pokédex <span className='text-yellow-400'>▼</span>
              </button>
              <ul
                className={`z-10 absolute ${
                  isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                } bg-green-400 text-white text-center transition-opacity duration-500`}
                onClick={closeMenu}
              >
                { pokemonNavElements }
              </ul>
            </div>
          </li>
          { otherNavElements }
        </ul>
      </nav>
    </>
  )
}

export default NavBar;
