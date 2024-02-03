import React from 'react'
import Skeleton from 'react-loading-skeleton'

const PokeCardSkeleton = ({ cardCount }) => {
  return Array(cardCount)
    .fill(0)
    .map((_, index) => (
      <div
        className="flex w-48 flex-col items-center justify-center rounded-xl border border-slate-200 p-2 duration-200 sm:w-56"
        key={index}
      >
        <div className="w-full flex-1">
          <Skeleton width="100%" />
        </div>
        <div className="w-full flex-1 text-xl">
          <Skeleton />
        </div>
        <div className="flex-1">
          <Skeleton circle width="100px" height="100px" />
        </div>
        <div className="mb-2 mt-4 w-full flex-1">
          <Skeleton />
        </div>
      </div>
    ))
}

export default PokeCardSkeleton
