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
        <div className='py-4 text-white bg-gray-800 min-h-screen max-w-full'>
          <ScrollToTop />
          <AnimatedRoutes />
        </div>
      </QueryClientProvider>
    </>  
  )
}

export default App;