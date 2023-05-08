import { React } from 'react'
import { Routes, Route } from 'react-router-dom'
import './index.css'
import NavBar from './components/NavBar'
import MainPage from './components/MainPage'
import WelcomePage from './components/WelcomePage'
import PokemonDetail from './components/PokemonDetail/PokemonDetail'
import TypeDetail from './components/OtherDetails/TypeDetail'

const App = () => {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path='' element={<WelcomePage />} />
        <Route path='/pokemon/generation-1' element={<MainPage idRange={[1, 151]} />} />
        <Route path='/pokemon/generation-2' element={<MainPage idRange={[152, 251]} />} />
        <Route path='/pokemon/generation-3' element={<MainPage idRange={[252, 386]} />} />
        <Route path='/pokemon/generation-4' element={<MainPage idRange={[387, 493]} />} />
        <Route path='/pokemon/generation-5' element={<MainPage idRange={[494, 649]} />} />
        <Route path='/pokemon/generation-6' element={<MainPage idRange={[650, 721]} />} />
        <Route path='/pokemon/:id' element={<PokemonDetail />} />
        <Route path='/types/:type' element={<TypeDetail />} />
      </Routes>
    </>  
  )
}

export default App;