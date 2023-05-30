import React, { lazy, Suspense } from 'react'
import MainPage from '../pages/MainPage'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
// Lazy loaded components
const WelcomePage = lazy(() => import('../pages/WelcomePage'))
const PokemonDetail = lazy(() => import('../pages/PokemonDetail'))
const TypeDetail = lazy(() => import('./OtherDetails/TypeDetail'))
const MoveDetail = lazy(() => import('../pages/MoveDetail'))
const TypeListing = lazy(() => import('../pages/TypeListing'))
const MoveListing = lazy(() => import('../pages/MoveListing'))

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
      <Suspense>
        <Routes location={location} key={location.pathname}>
          <Route path='' element={<WelcomePage />} />
          <Route path='/types' element={<TypeListing />} />
          <Route path='/moves' element={<MoveListing />} />
          {generationRoutes}
          <Route path='/pokemon/:id' element={<PokemonDetail />} />
          <Route path='/types/:type' element={<TypeDetail />} />
          <Route path='/moves/:id' element={<MoveDetail />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  )
}

export default AnimatedRoutes