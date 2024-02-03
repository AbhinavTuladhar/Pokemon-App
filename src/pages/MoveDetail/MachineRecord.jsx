import React from 'react'
import { useQueries } from '@tanstack/react-query'
import TableContainer from '../../components/TableContainer'
import SectionTitle from '../../components/SectionTitle'
import fetchData from '../../utils/fetchData'
import generationMapping from '../../utils/generationMapping'
import formatName from '../../utils/NameFormatting'
import TabularSkeleton from '../../components/TabularSkeleton'

const MachineRecord = ({ machineList }) => {
  const urlList = machineList?.map((machine) => machine.machine.url)

  const { data: machineInfo, isLoading } = useQueries({
    queries: urlList
      ? urlList.map((url) => {
          return {
            queryKey: ['machine-url', url],
            queryFn: ({ signal }) => fetchData(url, signal),
            staleTime: Infinity,
            cacheTime: Infinity,
            select: (machine) => {
              const versionName = machine.version_group.name
              const TMNumber = machine.item.name
              const formattedTM = TMNumber.slice(0, 2).toUpperCase() + TMNumber.slice(2)

              return {
                name: machine.move.name,
                machine: formattedTM,
                versionName: versionName,
                generation: generationMapping[versionName],
              }
            },
          }
        })
      : [],
    combine: (results) => {
      const formattedData = results
        ?.map((result) => result?.data)
        ?.filter((machine) => machine?.versionName !== 'colosseum' && machine?.versionName !== 'xd')
      const transformedData = formattedData?.reduce((accumulator, item) => {
        const { machine, generation, versionName } = item || {}
        if (accumulator[generation] !== undefined) {
          accumulator[generation]?.versionName?.push(versionName)
        } else {
          accumulator[generation] = {
            machine,
            generation,
            versionName: [versionName],
          }
        }
        return accumulator
      }, {})
      const finalFormattedData = transformedData ? Object.values(transformedData) : []

      return {
        data: finalFormattedData,
        isLoading: results.some((result) => result.isLoading),
      }
    },
  })

  const tableRows = machineInfo?.map((machine, rowIndex) => {
    return (
      <div className="table-row h-12" key={rowIndex}>
        <div className="table-cell w-3/5 border-t border-slate-200 py-2 text-right align-middle">
          <ul>
            {machine.versionName?.map((version, index) => {
              return (
                <li className="list-none" key={index}>
                  {' '}
                  {formatName(version)}{' '}
                </li>
              )
            })}
          </ul>
        </div>
        <div className="table-cell h-12 w-2/5 border-t border-slate-200 py-2 pl-4 pr-2 align-middle">
          {machine?.machine}
        </div>
      </div>
    )
  })

  return (
    <>
      <SectionTitle text={'Machine/Record'} />
      <div className="w-full">
        {isLoading ? <TabularSkeleton /> : <TableContainer child={tableRows} />}
      </div>
    </>
  )
}

export default MachineRecord
