import { React } from 'react'
import { Routes, Route } from 'react-router-dom'
import './index.css'
import NavBar from './components/NavBar'
import MainPage from './components/MainPage'
import WelcomePage from './components/WelcomePage'
import PokemonDetail from './components/PokemonDetail/PokemonDetail'
import TypeDetail from './components/OtherDetails/TypeDetail'
import ScrollToTop from './components/ScrollToTop'

const App = () => {
  return (
    <>
      <NavBar />
      <div className='pt-4 text-white bg-gradient-to-br from-slate-600 to-slate-900 min-h-screen'>
        <ScrollToTop />
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
      </div>
    </>  
  )
}

export default App;