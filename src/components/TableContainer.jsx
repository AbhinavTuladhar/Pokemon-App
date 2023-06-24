import React from 'react'

const TableContainer = ( { child }) => {
  return (
    <div className='overflow-x-auto overflow-y-hidden'>
      <div className='border-b-[1px] border-slate-400 min-w-full table'>
        { child }
      </div>
    </div>
  )
}

export default TableContainer