import React from 'react'
import { useQuery } from 'react-query'
import TableContainer from '../../components/TableContainer'
import SectionTitle from '../../components/SectionTitle'
import fetchData from '../../utils/fetchData'
import generationMapping from '../../utils/generationMapping'
import formatName from '../../utils/NameFormatting'

const MachineRecord = ({ machineList }) => {
  const urlList = machineList?.map(machine => machine.machine.url)

  // Transforming the data of the API response.
  const transformData = machineData => {
    const formattedData = machineData
      ?.map(machine => {
        const versionName = machine.version_group.name
        // Reformat the TM number.
        const TMNumber = machine.item.name
        const formattedTM = TMNumber.slice(0, 2).toUpperCase() + TMNumber.slice(2)
        return {
          name: machine.move.name,
          machine: formattedTM,
          versionName: versionName,
          generation: generationMapping[versionName]
        }
      })
      ?.filter(machine => machine.versionName !== 'colosseum' && machine.versionName !== 'xd')

    // Now group the formattedData by generation.
    const transformedData = formattedData?.reduce((accumulator, item) => {
      const { machine, generation, versionName } = item;
      if (accumulator[generation] !== undefined) {
        accumulator[generation]?.versionName?.push(versionName);
      } else {
        accumulator[generation] = {
          machine,
          generation,
          versionName: [versionName],
        };
      }
      return accumulator;
    }, {});
    const finalFormattedData = transformedData ? Object.values(transformedData) : []
    return finalFormattedData
  }

  // This is for querying the list of urls.
  const { data: machineInfo } = useQuery(
    ['moveData', machineList],
    () => Promise.all(urlList?.map(fetchData)),
    { staleTime: Infinity, cacheTime: Infinity, select: transformData }
  )

  // Now for the table rows.
  const tableRows = machineInfo?.map((machine, rowIndex) => {
    return (
      <div className='table-row' key={rowIndex}>
        <div className='table-cell px-4 py-2 h-12 border-t border-slate-200 align-middle text-right'>
          <ul>
            {machine.versionName?.map((version, index) => {
              return (<li className='list-none' key={index}> {formatName(version)} </li>)
            })}
          </ul>
        </div>
        <div className='table-cell px-4 py-2 h-12 border-t border-slate-200 align-middle'>
          {machine?.machine}
        </div>
      </div>
    )
  })

  return (
    <>
      <SectionTitle text={'Machine/Record'} />
      <div className='w-full'>
        <TableContainer child={tableRows} />
      </div>
    </>
  )
}

export default MachineRecord