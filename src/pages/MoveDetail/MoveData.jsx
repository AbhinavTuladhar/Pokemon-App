import React from 'react'
import TypeCard from '../../components/TypeCard'
import TableContainer from '../../components/TableContainer'
import TabularSkeleton from '../../components/TabularSkeleton'
import SectionTitle from '../../components/SectionTitle'
import formatName from '../../utils/NameFormatting'
import movePhysical from '../../images/move-physical.png'
import moveSpecial from '../../images/move-special.png'
import moveStatus from '../../images/move-status.png'

// For damage class image.
const returnMoveImage = (damageClass) => {
  if (damageClass === 'physical') return movePhysical
  else if (damageClass === 'special') return moveSpecial
  else if (damageClass === 'status') return moveStatus
  else return ''
}

const MoveData = ({ moveInfo }) => {
  const { moveType, damageClass, power, accuracy, PP, generationIntroduced, priority } = moveInfo

  const propsFlag = Object.keys(moveInfo).length > 0

  const rowData = [
    { header: 'Type', value: <TypeCard typeName={moveType} /> },
    {
      header: 'Category',
      value: (
        <div className="flex flex-row items-center gap-x-4">
          <img src={returnMoveImage(damageClass)} className="h-[20px] w-[30px]" alt={damageClass} />
          <> {formatName(damageClass)} </>
        </div>
      ),
    },
    { header: 'Power', value: power },
    { header: 'Accuracy', value: accuracy },
    { header: 'Priority', value: priority },
    { header: 'PP', value: <> {`${PP} (max. ${Math.floor(PP * 1.6)})`} </> },
    { header: 'Introduced', value: generationIntroduced },
  ]

  const tableRows = rowData.map((row, rowIndex) => {
    // Skip the priority row if the priority is zero.
    if (row.header === 'Priority' && row.value === 0) {
      return null
    }
    // Add a positive sign to priority if positive.
    const rowValue =
      row.header === 'Priority' && parseInt(row.value) > 0 ? `+${row.value}` : row.value
    return (
      <div className="table-row h-12" key={rowIndex}>
        <div
          key={row.header}
          className="table-cell border-t border-slate-200 py-2 pr-8 text-right align-middle"
        >
          {row.header}
        </div>
        <div key={row.value} className="table-cell border-t border-slate-200 py-2 align-middle">
          {rowValue}
        </div>
      </div>
    )
  })

  return (
    <>
      <SectionTitle text={'Move data'} />
      <div className="w-full">
        {propsFlag ? <TableContainer child={tableRows} /> : <TabularSkeleton />}
      </div>
    </>
  )
}

export default MoveData
