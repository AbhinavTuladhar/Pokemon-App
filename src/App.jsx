import { React } from 'react'
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import './index.css'
import { SkeletonTheme } from 'react-loading-skeleton'
import NavBar from './components/NavBar'
import AnimatedRoutes from './components/AnimatedRoutes'
import ScrollToTop from './components/ScrollToTop'

const App = () => {
  const queryClient = new QueryClient()

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <SkeletonTheme baseColor="#313131" highlightColor="#525252">
          <div className="min-h-screen max-w-full bg-gray-950 text-white">
            <NavBar />
            <section className="mx-4 pb-4 md:mx-8">
              <ScrollToTop />
              <AnimatedRoutes />
            </section>
          </div>
        </SkeletonTheme>
      </QueryClientProvider>
    </>
  )
}

export default App
