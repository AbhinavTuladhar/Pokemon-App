import React from 'react'
import Skeleton from 'react-loading-skeleton'

const PokeCardSkeleton = ({ cardCount }) => {
  return (
    Array(cardCount).fill(0).map(item => (
      <div className='flex flex-col items-center justify-center w-full py-2 m-4 border rounded-xl smmd:w-2/12 sm:w-1/3 md:w-1/4 border-slate-200'>
        <div className='flex-1 w-full'>
          <Skeleton width='100%' />
        </div>
        <div className='flex-1 w-full text-xl'>
          <Skeleton />
        </div>
        <div className='flex-1'>
          <Skeleton circle width='100px' height='100px' />
        </div>
        <div className='flex-1 w-full mt-4 mb-2'>
          <Skeleton />
        </div>
      </div>
    ))
  )
}

export default PokeCardSkeleton