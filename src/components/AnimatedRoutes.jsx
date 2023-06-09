import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import PokemonListing from '../pages/PokemonListing'
import WelcomePage from '../pages/WelcomePage'
import PokemonDetail from '../pages/PokemonDetail/PokemonDetail'
import TypeDetail from '../pages/TypeDetail/TypeDetail'
import MoveDetail from '../pages/MoveDetail/MoveDetail'
import TypeListing from '../pages/TypeListing'
import MoveListing from '../pages/MoveListing'
import AbilityListing from '../pages/AbilityListing'
import AbilityDetail from '../pages/AbilityDetail/AbilityDetail'
import LocationList from '../pages/LocationList'
import LocationDetail from '../pages/LocationDetail/LocationDetail'

const AnimatedRoutes = () => {
  const location = useLocation()
  const generationRouteData = [
    { path: '/pokemon/generation-1', idRange: [1, 151]},
    { path: '/pokemon/generation-2', idRange: [152, 251]},
    { path: '/pokemon/generation-3', idRange: [252, 386]},
    { path: '/pokemon/generation-4', idRange: [387, 493]},
    { path: '/pokemon/generation-5', idRange: [494, 649]},
    { path: '/pokemon/generation-6', idRange: [650, 721]},
    { path: '/pokemon/generation-7', idRange: [722, 807]},
    { path: '/pokemon/forms', idRange: [10001, 10157]},
  ]

  const generationRoutes = generationRouteData.map(gen => {
    return (
      <Route path={gen.path} element={<PokemonListing idRange={gen.idRange} />} />
    )
  })

  return (
    <AnimatePresence mode='wait'>
      <Routes location={location} key={location.pathname}>
        <Route path='' element={<WelcomePage />} />
        <Route path='/types' element={<TypeListing />} />
        <Route path='/moves' element={<MoveListing />} />
        <Route path='/ability' element={<AbilityListing />} />
        <Route path='/location' element={<LocationList />} />
        {generationRoutes}
        <Route path='/pokemon/:id' element={<PokemonDetail />} />
        <Route path='/types/:type' element={<TypeDetail />} />
        <Route path='/moves/:id' element={<MoveDetail />} />
        <Route path='/ability/:id' element={<AbilityDetail />} />
        <Route path='/location/:name' element={<LocationDetail />} />
      </Routes>
    </AnimatePresence>
  )
}

export default AnimatedRoutes