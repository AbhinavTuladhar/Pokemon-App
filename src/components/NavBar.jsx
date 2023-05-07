import React from 'react'
import { NavLink } from 'react-router-dom'

const NavBar = () => {
  const linkData = [
    { path: '/gen-1', name: 'Generation 1'},
    { path: '/gen-2', name: 'Generation 2'},
    { path: '/gen-3', name: 'Generation 3'},
    { path: '/gen-4', name: 'Generation 4'},
    { path: '/gen-5', name: 'Generation 5'},
    { path: '/gen-6', name: 'Generation 6'}
  ]

  const navElements = linkData.map(data => {
    return (
      <li className='hover:brightness-110 duration-500 text-white'>
        <NavLink to={data.path}> {data.name} </NavLink>
      </li>
    )
  })

  return (
    <nav className='bg-green-400'>
      <div className='bg-slate-900 text-white py-4'>
        Test
      </div>
      <ul className='flex justify-left list-none py-4 px-2 gap-16'>
        {navElements}
      </ul>
    </nav>
  )
}

export default NavBar;