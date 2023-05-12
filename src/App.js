import { React } from 'react'
import { Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import './index.css'
import NavBar from './components/NavBar'
import MainPage from './components/MainPage'
import WelcomePage from './components/WelcomePage'
import PokemonDetail from './components/PokemonDetail/PokemonDetail'
import TypeDetail from './components/OtherDetails/TypeDetail'
import ScrollToTop from './components/ScrollToTop'

const App = () => {
  const queryClient = new QueryClient()
  const generationRouteData = [
    { path: '/pokemon/generation-1', idRange: [1, 151]},
    { path: '/pokemon/generation-2', idRange: [152, 251]},
    { path: '/pokemon/generation-3', idRange: [252, 386]},
    { path: '/pokemon/generation-4', idRange: [387, 493]},
    { path: '/pokemon/generation-5', idRange: [494, 649]},
    { path: '/pokemon/generation-6', idRange: [650, 721]},
  ]
  const generationRoutes = generationRouteData.map(gen => {
    return (
      <Route path={gen.path} element={<MainPage idRange={gen.idRange} />} />
    )
  })
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <NavBar />
        <div className='pt-4 text-white bg-gradient-to-br from-slate-600 to-slate-900 min-h-screen pb-4'>
          <ScrollToTop />
          <Routes>
            <Route path='' element={<WelcomePage />} />
            {generationRoutes}
            <Route path='/pokemon/:id' element={<PokemonDetail />} />
            <Route path='/types/:type' element={<TypeDetail />} />
          </Routes>
        </div>
      </QueryClientProvider>
    </>  
  )
}

export default App;