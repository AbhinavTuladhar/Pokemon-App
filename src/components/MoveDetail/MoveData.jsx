import React from 'react'
import TypeCard from '../TypeCard'
import TableContainer from '../TableContainer'
import SectionTitle from '../SectionTitle'
import formatName from '../../utils/NameFormatting'

const MoveData = ({ moveInfo }) => {
  console.log('in move data', moveInfo)

  const {
    moveType, 
    damageClass,
    power,
    accuracy,
    PP,
    generationIntroduced
  } = moveInfo
  
  const rowData = [
    { header: 'Type', value: <TypeCard typeName={ moveType } /> },
    { header: 'Category', value: formatName(damageClass) },
    { header: 'Power', value: power, },
    { header: 'Accuracy', value: accuracy, },
    { header: 'PP', value: <> { `${PP} (max. ${PP*1.6})` } </>, },
    { header: 'Introduced', value: generationIntroduced }
  ]

  const tableRows = rowData.map(row => {
    return (
      <div className='table-row h-12'>
        <div className="table-cell align-middle text-right border-t-[1px] py-2 pr-8 border-slate-200"> 
          { row.header }
        </div>
        <div className="table-cell align-middle border-t-[1px] py-2 border-slate-200"> 
          { row.value }
        </div>
      </div>
    )
  })

  return (
    <>
      <SectionTitle text={'Move data'} />
      <div className='lg:w-1/4 w-full'>
        <TableContainer child={tableRows} />
      </div>
    </>
  )
}

export default MoveData