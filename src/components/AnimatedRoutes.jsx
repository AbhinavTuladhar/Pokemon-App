import React from 'react'
import MainPage from '../pages/MainPage'
import WelcomePage from '../pages/WelcomePage'
import PokemonDetail from '../pages/PokemonDetail'
import TypeDetail from './OtherDetails/TypeDetail'
import MoveDetail from '../pages/MoveDetail'
import TypeListing from '../pages/TypeListing'
import MoveListing from '../pages/MoveListing'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

const AnimatedRoutes = () => {
  const location = useLocation()
  const generationRouteData = [
    { path: '/pokemon/generation-1', idRange: [1, 151]},
    { path: '/pokemon/generation-2', idRange: [152, 251]},
    { path: '/pokemon/generation-3', idRange: [252, 386]},
    { path: '/pokemon/generation-4', idRange: [387, 493]},
    { path: '/pokemon/generation-5', idRange: [494, 649]},
    { path: '/pokemon/generation-6', idRange: [650, 721]},
    { path: '/pokemon/forms', idRange: [10001, 10271]},
  ]

  const generationRoutes = generationRouteData.map(gen => {
    return (
      <Route path={gen.path} element={<MainPage idRange={gen.idRange} />} />
    )
  })

  return (
    <AnimatePresence mode='wait'>
      <Routes location={location} key={location.pathname}>
        <Route path='' element={<WelcomePage />} />
        <Route path='/types' element={<TypeListing />} />
        <Route path='/moves' element={<MoveListing />} />
        {generationRoutes}
        <Route path='/pokemon/:id' element={<PokemonDetail />} />
        <Route path='/types/:type' element={<TypeDetail />} />
        <Route path='/move/:id' element={<MoveDetail />} />
      </Routes>
    </AnimatePresence>
  )
}

export default AnimatedRoutes