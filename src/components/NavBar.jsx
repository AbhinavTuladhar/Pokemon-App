import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const ListItem = ({ items, closeMenu, subMenuFlag }) => {
  return (
    items.map((data, index) => (
      <li className={`float-left min-h-full ${subMenuFlag && 'w-full'}`} key={index}>
        <NavLink to={ data.path } onClick={closeMenu}>
          <span className={`bg-green-400 hover:brightness-110 duration-300 text-white block text-center 
            ${subMenuFlag ? 'p-1' : 'p-4'}`}
          > { data.name } 
          </span>
        </NavLink>
      </li>
    ))
  )
}

const NavBar = () => {
  const linkData = [
    { path: '/pokemon/generation-1', name: 'Generation 1' },
    { path: '/pokemon/generation-2', name: 'Generation 2' },
    { path: '/pokemon/generation-3', name: 'Generation 3' },
    { path: '/pokemon/generation-4', name: 'Generation 4' },
    { path: '/pokemon/generation-5', name: 'Generation 5' },
    { path: '/pokemon/generation-6', name: 'Generation 6' },
    { path: '/pokemon/forms', name: 'Other forms'},
    { path: '/types', name: 'Types'},
    { path: '/moves', name: 'Moves'},
    { path: '/ability', name: 'Abilities'}
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

  const pokemonNavElements = <ListItem items={linkData.slice(0, 7)} closeMenu={closeMenu} subMenuFlag={true} />
  const otherNavElements = <ListItem items={linkData.slice(7)} closeMenu={closeMenu} subMenuFlag={false} />

  return (
    <>
      <div className='bg-slate-900 text-yellow-400 py-2 text-center text-6xl font-extrabold tracking-wider flex flex-wrap justify-center'>
        <NavLink to='/'> Pokémon Database </NavLink>
      </div>
      <nav>
        <ul className='bg-green-400 flex justify-left list-none flex-wrap'>
          <li className='float-left'>
            <div
              className='relative group'
              onMouseEnter={openMenu}
              onMouseLeave={closeMenu}
              onClick={toggleMenu}
            >
              <button className='w-full bg-green-400 hover:brightness-110 duration-300 text-white block text-center p-4'>
                Pokédex <span className='text-yellow-400'>▼</span>
              </button>
              <ul
                className={`z-10 absolute ${
                  isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                } bg-green-400 text-white text-center py-1 px-0 space-y-2 transition-opacity duration-500`}
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
