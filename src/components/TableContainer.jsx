import React from 'react'

const TableContainer = ({ child }) => {
  return (
    <div className="overflow-x-auto overflow-y-hidden">
      <div className="table min-w-full border-none border-transparent">{child}</div>
    </div>
  )
}

export default TableContainer
