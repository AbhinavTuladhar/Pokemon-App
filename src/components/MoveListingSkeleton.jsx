import React from 'react'
import Skeleton from 'react-loading-skeleton'

const MoveListingSkeleton = ({ rowCount }) => {
  const tableChild = Array(rowCount)
    .fill(0)
    .map((_, index) => (
      <div className="table-row" key={index}>
        <div className="table-cell h-12 w-full border-t border-gray-500 p-2 align-middle">
          <div className="w-full flex-1">
            <Skeleton width="100%" />
          </div>
        </div>
      </div>
    ))

  return <div className="table min-w-full border-b border-gray-500">{tableChild}</div>
}

export default MoveListingSkeleton
