import React from 'react'
import Skeleton from 'react-loading-skeleton'

const MoveListingSkeleton = ({ rowCount }) => {
  const tableChild = (Array(rowCount).fill(0).map((_, index) => (
    <div className='table-row' key={index}>
      <div className='w-full border-gray-500 border-t table-cell h-12 align-middle p-2'>
        <div className='flex-1 w-full'>
          <Skeleton width='100%' />
        </div>
      </div>
    </div>
  )))

  return (
    <div className='table border-gray-500 border-b min-w-full'>
      {tableChild}
    </div>
  )
}

export default MoveListingSkeleton