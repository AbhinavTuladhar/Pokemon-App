import { React, useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './index.css'
import NavBar from './components/NavBar'
import MainPage from './components/MainPage'
import WelcomePage from './components/WelcomePage'
import PokemonDetail from './components/PokemonDetail'

const App = () => {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path='' element={<WelcomePage />} />
        <Route path='/gen-1' element={<MainPage idRange={[1, 151]} />} />
        <Route path='/gen-2' element={<MainPage idRange={[152, 251]} />} />
        <Route path='/gen-3' element={<MainPage idRange={[252, 386]} />} />
        <Route path='/gen-4' element={<MainPage idRange={[387, 493]} />} />
        <Route path='/gen-5' element={<MainPage idRange={[494, 649]} />} />
        <Route path='/gen-6' element={<MainPage idRange={[650, 721]} />} />
        <Route path='/pokemon/:id' element={<PokemonDetail />} />
      </Routes>
    </>  
  )
}

export default App;