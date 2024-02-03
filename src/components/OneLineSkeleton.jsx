import React from 'react'
import Skeleton from 'react-loading-skeleton'

const OneLineSkeleton = () => {
  return (
    <div className="w-full flex-1">
      <Skeleton width="100%" />
    </div>
  )
}

export default OneLineSkeleton
