import React from 'react'
import Skeleton from 'react-loading-skeleton'

const TabularSkeleton = () => {
  const skeletonRows = Array(8).fill(0).map((_, index) => (
    <Skeleton width='100%' height='2.75rem' containerClassName='flex-1 w-full' key={index} />
  ))

  return (
    <div className='flex flex-col'>
      {skeletonRows}
    </div>
  )
}

export default TabularSkeleton