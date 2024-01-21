import React from 'react'
import { useQueries, useQuery } from '@tanstack/react-query'
import fetchData from '../utils/fetchData'
import { extractNatureInformation } from '../utils/extractInfo'
import SectionTitle from '../components/SectionTitle'
import formatName from '../utils/NameFormatting'
import { motion } from 'framer-motion'
import MoveListingSkeleton from '../components/MoveListingSkeleton'

const TableRow = ({ children, extraClassName }) => {
  return <div className={`${extraClassName} table-row border-t border-gray-200 h-12`}>{children}</div>
}

const TableCell = ({ children, extraClassName }) => {
  return (
    <div
      className={`table-cell px-2 py-1 align-middle border border-gray-200 ${extraClassName} w-36 whitespace-nowrap lg:whitespace-normal lg:max-w-xs`}
    >
      {children}
    </div>
  )
}

const NatureListing = () => {
  const { data: natureList, isLoading } = useQuery({
    queryKey: ['nature-list'],
    queryFn: () => fetchData(`https://pokeapi.co/api/v2/nature?limit=25`),
    staleTime: Infinity,
    cacheTime: Infinity,
    select: (data) => {
      const { results } = data
      return results.map((nature) => {
        const { name, url } = nature
        return { nature: name, url }
      })
    },
  })

  const { data: natureData, isFullyLoaded: isFullyLoadedNatureData } = useQueries({
    queries: natureList
      ? natureList.map((nature) => {
          return {
            queryKey: ['nature', nature.url],
            queryFn: () => fetchData(nature.url),
            staleTime: Infinity,
            cacheTime: Infinity,
            enabled: !isLoading,
            select: extractNatureInformation,
          }
        })
      : [],
    combine: (results) => {
      return {
        data: results?.map((result) => result?.data)?.sort((a, b) => a?.name?.localeCompare(b?.name)),
        isLoading: results.some((result) => result.isLoading),
        isFullyLoaded: results.every((result) => result.data !== undefined),
      }
    },
  })

  const tableHeaderNames = ['Nature', 'Increases', 'Decreases', 'Likes', 'Hates']
  const tableHeader = (
    <TableRow extraClassName="font-bold bg-[#1a1a1a]">
      {tableHeaderNames.map((header, headerIndex) => {
        return <TableCell key={headerIndex}>{header}</TableCell>
      })}
    </TableRow>
  )

  const tableRows = natureData
    ?.filter((nature) => nature !== undefined)
    ?.map((nature, rowIndex) => {
      const { decreasedStat, hatesFlavour, increasedStat, likesFlavour, name } = nature

      const cellData = [
        { key: 'nature', value: formatName(name) },
        { key: 'increases', value: formatName(increasedStat) },
        { key: 'decreases', value: formatName(decreasedStat) },
        { key: 'likes', value: formatName(likesFlavour) },
        { key: 'hates', value: formatName(hatesFlavour) },
      ]

      return (
        <TableRow key={rowIndex}>
          {cellData.map((cell, cellIndex) => (
            <TableCell key={cellIndex} extraClassName="text-left">
              {cell.value}
            </TableCell>
          ))}
        </TableRow>
      )
    })

  const tableData = (
    <>
      {tableHeader}
      {tableRows}
    </>
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transitionDuration: '0.8s' }}
      exit={{ opacity: 0, transitionDuration: '0.75s' }}
      className="text-center"
    >
      <SectionTitle text="Natures" />
      <main className="block md:flex md:flex-col md:items-center">
        {isFullyLoadedNatureData && natureData?.length > 0 ? (
          <div className="overflow-x-auto overflow-y-hidden">
            <div className="border-b border-slate-400 table">{tableData}</div>
          </div>
        ) : (
          <MoveListingSkeleton rowCount={20} />
        )}
      </main>
    </motion.div>
  )
}

export default NatureListing
