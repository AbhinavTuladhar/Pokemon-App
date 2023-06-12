import React from 'react'
import TypeCard from '../../components/TypeCard'
import TableContainer from '../../components/TableContainer'
import SectionTitle from '../../components/SectionTitle'
import formatName from '../../utils/NameFormatting'
import movePhysical from '../../images/move-physical.png'
import moveSpecial from '../../images/move-special.png'
import moveStatus from '../../images/move-status.png'

// For damage class image.
const returnMoveImage = damageClass => {
  if (damageClass === 'physical')
    return movePhysical
  else if (damageClass === 'special')
    return moveSpecial
  else if (damageClass === 'status')
    return moveStatus
  else
    return ''
}

const MoveData = ({ moveInfo }) => {
  const {
    moveType, 
    damageClass,
    power,
    accuracy,
    PP,
    generationIntroduced,
    priority
  } = moveInfo
  
  const rowData = [
    { header: 'Type', value: <TypeCard typeName={ moveType } /> },
    { 
      header: 'Category', 
      value: 
        (<div className='flex flex-row gap-x-4 items-center'>
          <img src={returnMoveImage(damageClass)} className='h-[20px] w-[30px]' alt={damageClass} />
          <> {formatName(damageClass)} </>
        </div>)
    },
    { header: 'Power', value: power, },
    { header: 'Accuracy', value: accuracy, },
    { header: 'Priority', value: priority },
    { header: 'PP', value: <> { `${PP} (max. ${PP*1.6})` } </>, },
    { header: 'Introduced', value: generationIntroduced }
  ]

  const tableRows = rowData.map(row => {
    // Skip the priority row if the priority is zero.
    if (row.header === 'Priority' && row.value === 0) {
      return null
    }
    // Add a positive sign to priority if positive.
    const rowValue = row.header === 'Priority' && parseInt(row.value) > 0 ? `+${row.value}` : row.value
    return (
      <div className='table-row h-12'>
        <div key={ row.header } className="table-cell align-middle text-right border-t-[1px] py-2 pr-8 border-slate-200"> 
          { row.header }
        </div>
        <div key={ row.value } className="table-cell align-middle border-t-[1px] py-2 border-slate-200"> 
          { rowValue }
        </div>
      </div>
    )
  })

  return (
    <>
      <SectionTitle text={'Move data'} />
      <div className='w-full'>
        <TableContainer child={tableRows} />
      </div>
    </>
  )
}

export default MoveData