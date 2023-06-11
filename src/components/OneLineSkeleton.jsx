import React from 'react'
import Skeleton from 'react-loading-skeleton'

const OneLineSkeleton = () => {
  return (
    <div className='flex-1 w-full'>
      <Skeleton width='100%' />
    </div>
  )
}

export default OneLineSkeleton