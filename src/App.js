import { React } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import './index.css'
import { SkeletonTheme } from 'react-loading-skeleton';
import NavBar from './components/NavBar'
import AnimatedRoutes from './components/AnimatedRoutes'
import ScrollToTop from './components/ScrollToTop'

const App = () => {
  const queryClient = new QueryClient()
  
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <SkeletonTheme baseColor="#313131" highlightColor="#525252">
          <div className='text-white bg-gray-950 min-h-screen max-w-full'>
            <NavBar />
            <section className='mx-4 md:mx-8 pb-4'>
              <ScrollToTop />
              <AnimatedRoutes />
            </section>
          </div>
        </SkeletonTheme>
      </QueryClientProvider>
    </>  
  )
}

export default App;