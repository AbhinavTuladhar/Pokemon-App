import React from 'react'

const TableContainer = ({ child }) => {
  return (
    <div className="overflow-x-auto overflow-y-hidden">
      <table className="border-b border-slate-400 min-w-full table">{child}</table>
    </div>
  )
}

export default TableContainer
