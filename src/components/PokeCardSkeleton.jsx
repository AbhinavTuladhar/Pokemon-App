import React from 'react'
import Skeleton from 'react-loading-skeleton'

const PokeCardSkeleton = ({ cardCount }) => {
  return (
    Array(cardCount).fill(0).map(item => (
      <div className='flex gap-y-2 rounded-xl flex-col justify-center items-center w-full smmd:w-2/12 sm:w-1/3 md:w-1/4 m-4 p-2 border border-slate-200'>
        <div className='flex-1 w-full'>
          <Skeleton width='100%' />
        </div>
        <div className='flex-1 w-full'>
          <Skeleton />
        </div>
        <div className='flex-1'>
          <Skeleton circle width='100px' height='100px' />
        </div>
        <div className='flex-1 w-full mx-1'>
          <Skeleton />
        </div>
    </div>
    ))
  )
}

export default PokeCardSkeleton