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
import EggGroupListing from '../pages/EggGroupListing'
import EggGroupDetail from '../pages/EggGroupDetail/EggGroupDetail'
import BerryListing from '../pages/BerryListing'

const AnimatedRoutes = () => {
  const location = useLocation()
  const generationRouteData = [
    { path: '/pokemon/generation-1', idRange: [1, 151] },
    { path: '/pokemon/generation-2', idRange: [152, 251] },
    { path: '/pokemon/generation-3', idRange: [252, 386] },
    { path: '/pokemon/generation-4', idRange: [387, 493] },
    { path: '/pokemon/generation-5', idRange: [494, 649] },
    { path: '/pokemon/generation-6', idRange: [650, 721] },
    { path: '/pokemon/generation-7', idRange: [722, 807] },
    { path: '/pokemon/forms', idRange: [10001, 10157] },
  ]

  return (
    <AnimatePresence mode='wait'>
      <Routes location={location} key={location.pathname}>
        <Route path='' element={<WelcomePage />} key='home' />
        <Route path='/types' element={<TypeListing />} key='types' />
        <Route path='/moves' element={<MoveListing />} key='moves' />
        <Route path='/ability' element={<AbilityListing />} key='ability' />
        <Route path='/location' element={<LocationList />} key='location' />
        <Route path='/egg-group' element={<EggGroupListing />} key='egg-group' />
        <Route path='/berry' element={<BerryListing />} key='berry-list' />
        <Route path='/egg-group/:id' element={<EggGroupDetail />} key='egg-group-id' />
        <Route path='/pokemon/:id' element={<PokemonDetail />} key='pokemon-id' />
        <Route path='/types/:type' element={<TypeDetail />} key='type-id' />
        <Route path='/moves/:id' element={<MoveDetail />} key='move-id' />
        <Route path='/ability/:id' element={<AbilityDetail />} key='ability-id' />
        <Route path='/location/:name' element={<LocationDetail />} key='location-id' />

        {generationRouteData.map((gen, index) => (
          <Route path={gen.path} key={index} element={<PokemonListing idRange={gen.idRange} key={gen.path} />} />
        ))}
      </Routes>
    </AnimatePresence>
  )
}

export default AnimatedRoutes