import React from 'react'
import Skeleton from 'react-loading-skeleton'

const PokeCardSkeleton = ({ cardCount }) => {
  return (
    Array(cardCount).fill(0).map((_, index) => (
      <div className='flex flex-col items-center justify-center w-48 p-2 duration-200 border sm:w-56 rounded-xl border-slate-200' key={index}>
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