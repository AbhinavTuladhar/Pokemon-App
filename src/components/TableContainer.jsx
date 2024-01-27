import React from 'react'

const TableContainer = ({ child }) => {
  return (
    <div className="overflow-x-auto overflow-y-hidden">
      <div className="border-none border-transparent min-w-full table">{child}</div>
    </div>
  )
}

export default TableContainer
