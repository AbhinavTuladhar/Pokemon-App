import { React } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import './index.css'
import NavBar from './components/NavBar'
import AnimatedRoutes from './components/AnimatedRoutes'
import ScrollToTop from './components/ScrollToTop'

const App = () => {
  const queryClient = new QueryClient()
  
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <NavBar />
        <div className='pt-4 text-white bg-gradient-to-br from-slate-600 to-slate-900 min-h-screen max-w-screen-2xl min-w-min pb-4'>
          <ScrollToTop />
          <AnimatedRoutes />
        </div>
      </QueryClientProvider>
    </>  
  )
}

export default App;