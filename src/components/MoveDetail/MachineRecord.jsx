import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import axios from 'axios'
import TableContainer from '../TableContainer'
import SectionTitle from '../SectionTitle'
import generationMapping from '../../utils/generationMapping'
import formatName from '../../utils/NameFormatting'
import { transform } from 'framer-motion'

const MachineRecord = ({ machineList }) => {
  console.log('In machine records', machineList)
  const urlList = machineList?.map(machine => machine.machine.url)
  const [ machineInfo, setMachineInfo ] = useState([])

  const fetchData = async (url) => {
    const response = await axios.get(url)
    return response.data
  }

  // This is for querying the list of urls.
  const { data: machineData } = useQuery(
    ['moveData', machineList],
    () => Promise.all(urlList?.map(fetchData)),
    { staleTime: Infinity, cacheTime: Infinity }
  )

  useEffect(() => {
    if (machineData?.length === 0)
      return
    console.log('Logging machine response from machine record', machineData)
    // Now re-structure the objects in the array
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
    setMachineInfo(finalFormattedData)
    console.log('Logging transformed data', finalFormattedData)
  }, [machineData])
  
  useEffect(() => {
    if (machineInfo) console.log('Logging the machine info', machineInfo)
  }, [machineInfo])

  useEffect(() => {
    if (machineData) console.log('Logging the machine data', machineData)
  }, [machineData])

  // Now for the table rows.
  const tableRows = machineInfo?.map(machine => {
    return (
      <div className='table-row'>
        <div className='table-cell px-4 py-2 h-12 border-t-[1px] border-slate-200 align-middle text-right'>
          <ul>
            { machine.versionName?.map(version => {
              return (<li className='list-none' key={ version }> { formatName(version) } </li>)
            })}
          </ul>
        </div>
        <div className='table-cell px-4 py-2 h-12 border-t-[1px] border-slate-200 align-middle'>
          { machine?.machine }
        </div>
      </div>
    )
  })

  return (
    <>
      <SectionTitle text={'Machine/Record'} />
      <div className='w-full'>
        <TableContainer child={ tableRows } />
      </div>
    </>
  )
}

export default MachineRecord