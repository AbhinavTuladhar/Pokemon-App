import React from 'react'
import { useQuery, useQueries } from '@tanstack/react-query'
import fetchData from '../utils/fetchData'
import { extractBerryInformation, extractItemInformation } from '../utils/extractInfo'
import TableContainer from '../components/TableContainer'
import SectionTitle from '../components/SectionTitle'
import formatName from '../utils/NameFormatting'
import MoveListingSkeleton from '../components/MoveListingSkeleton'
import { motion } from 'framer-motion'
import { Tooltip } from 'react-tooltip'

const TableRow = ({ children, extraClassName }) => {
  return (
    <div className={`${extraClassName} table-row border-t border-gray-200 h-12`}>
      {children}
    </div>
  )
}

const TableCell = ({ children, extraClassName }) => {
  return (
    <div className={`table-cell p-1 align-middle border border-gray-200 ${extraClassName} whitespace-nowrap lg:whitespace-normal lg:max-w-lg leading-6`}>
      {children}
    </div>
  )
}

const BerryListing = () => {
  const { data: berryList } = useQuery({
    queryKey: ['berry'],
    queryFn: () => fetchData('https://pokeapi.co/api/v2/berry?limit=64'),
    staleTime: Infinity,
    cacheTime: Infinity,
    select: data => data.results
  })

  const { data: berryData, isFullyLoaded: isFullyLoadedBerryData } = useQueries({
    queries: berryList
      ? berryList.map((berry) => {
        return {
          queryKey: ['berry', berry.url],
          queryFn: () => fetchData(berry.url),
          staleTime: Infinity,
          cacheTime: Infinity,
          select: extractBerryInformation
        }
      })
      : [],
    combine: results => {
      return {
        data: results?.map(result => result?.data),
        isLoading: results.some(result => result.isLoading),
        isFullyLoaded: results.every(result => result.data !== undefined)
      }
    }
  })

  const berryUrls = berryData?.map(berry => berry?.url)

  const { data: itemData, isFullyLoaded: isFullyLoadedItemData } = useQueries({
    queries: berryUrls
      ? berryUrls.map((url) => {
        return {
          queryKey: ['berry-item', url],
          queryFn: () => fetchData(url),
          staleTime: Infinity,
          cacheTime: Infinity,
          select: extractItemInformation,
          enabled: !!isFullyLoadedBerryData
        }
      })
      : [],
    combine: results => {
      return {
        data: results?.map(result => result?.data),
        isLoading: results.some(result => result.isLoading),
        isFullyLoaded: results.every(result => result.data !== undefined)
      }
    }
  })


  // Now combining the two corresponding objects in the berry and itme arrays
  const berryInformation = berryData?.map(berry => {
    const foundItem = itemData?.find(item => item?.name === berry?.itemName)
    return { ...foundItem, ...berry, }
  })

  const tableHeaderNames = [
    { header: 'Gen', id: 'generation' },
    { header: 'No.', id: 'id' },
    { header: 'Sprite', id: 'sprite' },
    { header: 'Name', id: 'name' },
    { header: 'Effect(s)', id: 'entry' },
    { header: 'Growth time', id: 'growthTime' },
    { header: 'Firmness', id: 'firmness' },
    { header: 'Size (cm)', id: 'size' },
    { header: 'Max berries', id: 'maxHarvest' },
  ]
  const tableHeader = (
    <TableRow extraClassName='font-bold bg-[#1a1a1a]'>
      {tableHeaderNames.map((header, headerIndex) => {
        return (
          <TableCell key={headerIndex}>
            <div id={header.id} className={`${headerIndex >= 5 && 'hover:cursor-help'}`}>
              {header.header}
            </div>
          </TableCell>
        )
      })}
    </TableRow>
  )

  const dataRows = berryInformation?.map((berry, berryIndex) => {
    const { generationIntroduced, id, sprite, name, shortEntry, firmness, size, maxHarvest, growthTime } = berry
    const cellData = [
      { key: 'generation', value: generationIntroduced?.slice(generationIntroduced.length - 1), },
      { key: 'id', value: id, },
      {
        key: 'sprite', value: (
          <div className='flex justify-center'>
            <img src={sprite} alt='name' className='h-12' />
          </div>
        )
      },
      { key: 'name', value: formatName(name), },
      { key: 'entry', value: shortEntry, },
      { key: 'growthTime', value: growthTime, },
      { key: 'firmness', value: formatName(firmness), },
      { key: 'size', value: size / 10, },
      { key: 'maxHarvest', value: maxHarvest, },
    ]

    return (
      <TableRow key={berryIndex}>
        {cellData.map((cell, cellIndex) => (
          <TableCell key={cellIndex} extraClassName='text-left'>
            {cell.value}
          </TableCell>
        ))}
      </TableRow>
    )
  })

  const tableData = (
    <>
      {tableHeader}
      {dataRows}
    </>
  )

  const tooltipData = [
    { id: 'growthTime', text: 'Time it takes the tree to grow one stage, in hours.' },
    { id: 'firmness', text: 'The firmness of this berry, used in making Pokéblocks or Poffins.' },
    { id: 'size', text: 'The size of this Berry, in centimetres.' },
    { id: 'maxHarvest', text: 'The maximum number of these berries that can grow on one tree.' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transitionDuration: '0.8s' }}
      exit={{ opacity: 0, transitionDuration: '0.75s' }}
      className='text-center'
    >
      <SectionTitle text='Berries' />
      {(dataRows?.length === 0 || !isFullyLoadedBerryData || !isFullyLoadedItemData) ? (
        <MoveListingSkeleton rowCount={20} />
      ) : (
        <TableContainer child={tableData} />
      )}
      <>
        {tooltipData.map((tip, index) => (
          <Tooltip anchorSelect={`#${tip.id}`} place='bottom' key={index} style={{ backgroundColor: 'black', padding: '0.5rem' }} >
            <span className='text-xs'> {tip.text} </span>
          </Tooltip>
        ))}
      </>
    </motion.div>
  )
}

export default BerryListing