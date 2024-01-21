import React from 'react'
import Skeleton from 'react-loading-skeleton'

const TabularSkeleton = ({ rows = 8 }) => {
  const skeletonRows = Array(rows)
    .fill(0)
    .map((_, index) => <Skeleton width="100%" height="2.75rem" containerClassName="flex-1 w-full" key={index} />)

  return <div className="flex flex-col">{skeletonRows}</div>
}

export default TabularSkeleton
