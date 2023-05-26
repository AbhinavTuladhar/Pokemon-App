import { React, useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import axios from 'axios'
import formatName from '../../utils/NameFormatting'
import TypeCard from '../TypeCard'
import SectionTitle from '../SectionTitle'
import extractMoveInformation from '../../utils/extractMoveInfo'
import movePhysical from '../../images/move-physical.png'
import moveSpecial from '../../images/move-special.png'
import moveStatus from '../../images/move-status.png'

// This is for the headers
const firstRow = {
  moveName: 'Name',
  moveType: 'Type',
  damageClass: 'Class',
  PP: 'PP',
  power: "Power",
  accuracy: "Acc.",
}

// This is for the level up header only.
const firstRowLevelUp = {
  levelLearntAt: 'Lv.',
  ...firstRow
}

// This is for filtering out the moves on depending on how it is learnt - only for ORAS.
const separateMoves = ({ data, learnMethod }) => {
  const movesLearnt = data.map(move => {
    const { version_group_details } = move // this is an array
    const filteredMoves = version_group_details.filter(version => 
      version.move_learn_method.name === learnMethod
    )
    return {
      name: move.move.name,
      moveURL: move.move.url,
      version_group_details: filteredMoves
    }
  })
  const finalFilteredMoves = movesLearnt.filter(move => move.version_group_details.length > 0)
  return finalFilteredMoves
}

// This is for mapping the move damage class to its respective image.
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

const TableContainer = ( { child }) => {
  return (
    <div className='overflow-auto'>
      <div className='border-b-[1px] border-slate-400 min-w-full table'>
        { child }
      </div>
    </div>
  )
}

const MovesLearned = ({ data, id, name: pokemonName }) => {
  const { moves } = data;
  const [moveURLs, setMoveURLs] = useState({
    level: [],
    machine: [],
    tutor: [],
    egg: []
  })
  // This state is for keeping track of the level learnt value.
  const [levelLearntData, setLevelLearntData] = useState([])
  const [moveData, setMoveData] = useState([])
  const [finalMoveDetails, setFinalMoveDetails] = useState({
    level: [],
    tutor: [],
    egg: [],
    machine: []
  })

  useEffect(() => {
    // Consider that the latest gen is ORAS
    const ORASData = moves?.flatMap(move => {
      const { version_group_details } = move
      const ORASInfo = version_group_details.filter(version => 
        version.version_group.name === 'omega-ruby-alpha-sapphire'
      )
      return {
        ...move, 
        version_group_details: ORASInfo
      }
    })

    // Filter out the details in the version group details array is empty
    const finalORASData = ORASData.filter(move => move.version_group_details.length > 0)
    setMoveData(finalORASData)
  }, [moves])

  // This is for separating out the moves learnt by level up, TM/HM and by breeding.
  useEffect(() => {
    if (!moveData)
      return
    const levelUpMoves = separateMoves({data: moveData, learnMethod: 'level-up'})
    const machineMoves = separateMoves({data: moveData, learnMethod: 'machine'})
    const eggMoves = separateMoves({data: moveData, learnMethod: 'egg'})
    const tutorMoves = separateMoves({data: moveData, learnMethod: 'tutor'})

    // Now sort the moves by some conditions.
    // sort level up moves by the level learnt.
    const sortedLevelMoves = levelUpMoves.sort((curr, next) => {
      const levelLearntCurrent = curr.version_group_details[0].level_learned_at
      const levelLearntNext = next.version_group_details[0].level_learned_at
      if (levelLearntCurrent < levelLearntNext) 
        return -1
      else if (levelLearntCurrent > levelLearntNext)
        return 1
      else
        return (curr.name < next.name ? -1 : 1)
    })

    // Extract the move name and the level learnt for the moves learn by level up.
    setLevelLearntData(() => {
      return levelUpMoves?.map(move => {
        return {
          name: move.name,
          levelLearntAt: move.version_group_details[0].level_learned_at
        }
      })
    })
    setMoveURLs({
      level: sortedLevelMoves?.map(move => move.moveURL),
      machine: machineMoves?.map(move => move.moveURL),
      egg: eggMoves?.map(move => move.moveURL),
      tutor: tutorMoves?.map(move => move.moveURL),
    })
  }, [moveData])

  // Now query the moveURLs to obtain their details
  const fetchData = async (urls) => {
    const responses = await Promise.all(urls.map(url => axios.get(url)));
    return responses.map(response => response.data);
  }

  const { data: levelMoveDetails } = useQuery(
    ['levelDetails', moveURLs.level], 
    () => fetchData(moveURLs.level),
    { enabled: true }
  )

  const { data: tutorMoveDetails } = useQuery(
    ['tutorDetails', moveURLs.tutor], 
    () => fetchData(moveURLs.tutor),
    { enabled: true }
  )

  const { data: machineMoveDetails } = useQuery(
    ['machineDetails', moveURLs.machine], 
    () => fetchData(moveURLs.machine),
    { enabled: true }
  )

  const { data: eggMoveDetails } = useQuery(
    ['eggDetails', moveURLs.egg], 
    () => fetchData(moveURLs.egg),
    { enabled: true }
  )

  // For extracting information from the move details
  useEffect(() => {
    let levelExtracted = []
    let tutorExtracted = []
    let machineExtracted = []
    let eggExtracted = []
    if (levelMoveDetails?.length > 0)
      levelExtracted = levelMoveDetails?.map(move => extractMoveInformation(move))
    if (tutorMoveDetails?.length > 0)
      tutorExtracted = tutorMoveDetails?.map(move => extractMoveInformation(move))
    if (machineMoveDetails?.length > 0)
      machineExtracted = machineMoveDetails?.map(move => extractMoveInformation(move))
    if (eggMoveDetails?.length > 0)
      eggExtracted = eggMoveDetails?.map(move => extractMoveInformation(move))

    setFinalMoveDetails(() => {
      const combinedLevelData = levelLearntData?.map(obj1 => {
        const obj2 = levelExtracted?.find(obj => obj?.moveName === obj1?.name)
        return {...obj1, ...obj2}
      })

      return {
        level: [firstRowLevelUp, ...combinedLevelData],
        tutor: [firstRow, ...tutorExtracted],
        machine: [firstRow, ...machineExtracted],
        egg: [firstRow, ...eggExtracted]
      }
    })
  }, [levelMoveDetails, tutorMoveDetails, machineMoveDetails, eggMoveDetails, levelLearntData])

  // Return a tabular form of the levelup, machine, egg and tutor moves data.
  const returnMoveTable = data => {
    return data?.map((move, index) => {
      // Darken the first row, else create a hover effect
      const stringDecoration = index === 0 ? 'font-bold bg-[#1a1a1a]' : ''
      // For the damage class image
      const moveClassImage = returnMoveImage(move?.damageClass)
      // Check if it is the first column.
      const firstColStyle = move?.levelLearntAt ? '' : 'pl-4'
      // For zebra pattern
      const rowBg = index !== 0 && index % 2 === 0 ? 'bg-gray-900' : ''
      return (
        <div className={`${stringDecoration} ${rowBg} table-row border-[1px] border-slate-400`}>
          {
            move.levelLearntAt &&
            <div className='pl-4 table-cell align-middle h-12 border-t-[1px] border-slate-400 px-2'>
              {move?.levelLearntAt}
            </div>
          }
          <div className={`${firstColStyle} whitespace-nowrap table-cell align-middle h-12 border-t-[1px] border-slate-400 px-2`}>
            {formatName(move?.moveName)}
          </div>
          <div className='table-cell align-middle h-12 border-t-[1px] border-slate-400 px-2'>
            {
              index === 0 ? 
              'Type' :
              <TypeCard typeName={move?.moveType} />
            }
          </div>  
          <div className='table-cell align-middle h-12 border-t-[1px] border-slate-400 px-2'> 
            {
              moveClassImage === '' 
              ?
              move.damageClass
              :
              <img className='w-[30px] h-[20px]' src={moveClassImage} alt={move?.damageClass} />
            }
          </div>    
          <div className='table-cell align-middle h-12 border-t-[1px] border-slate-400 px-2'>
            {move?.PP}
          </div>   
          <div className='table-cell align-middle h-12 border-t-[1px] border-slate-400 px-2'>
            {move?.power}
          </div>
          <div className='table-cell align-middle h-12 border-t-[1px] border-slate-400 px-2'>
            {move?.accuracy}
          </div>
        </div>
      )
    })
  }

  const levelUpTable = returnMoveTable(finalMoveDetails?.level)
  const tutorTable = returnMoveTable(finalMoveDetails?.tutor)
  const machineTable = returnMoveTable(finalMoveDetails?.machine)
  const eggTable = returnMoveTable(finalMoveDetails?.egg)

  // return (
  //   <>
  //     <SectionTitle text={'Moves learnt by level up'} />
  //       {
  //         finalMoveDetails?.level?.length > 1 
  //         ?
  //         <TableContainer child={levelUpTable}  />
  //         :
  //         `${pokemonName} does not learn any moves by level up`
  //       }
  //   </>
  // )

  return (
    <div className='flex flex-row justify-between w-full flex-wrap'>
      <div className='flex flex-col lg:w-475/1000 w-full'>
        <SectionTitle text={'Moves learnt by level up'} />
        {
          finalMoveDetails?.level?.length > 1 
          ?
          <TableContainer child={levelUpTable}  />
          :
          `${pokemonName} does not learn any moves by level up`
        }

        <SectionTitle text={'Moves learnt by tutor'} />
        {
          finalMoveDetails?.tutor?.length > 1
          ?
          <TableContainer child={tutorTable} />
          :
          `${pokemonName} does not learn any move taught by a tutor.`
        }
        <SectionTitle text={'Moves learnt by Breeding'} />
        {
          finalMoveDetails?.egg?.length > 1
          ?
          <TableContainer child={eggTable} />
          :
          `${pokemonName} does not learn any moves by breeding.`
        }
      </div>
      <div className='flex flex-col lg:w-475/1000 w-full'>
        <SectionTitle text={'Moves learnt by HM/TM'} />
        {
          finalMoveDetails?.machine?.length > 1 
          ?
          <TableContainer child={machineTable} />
          :
          `${pokemonName} does not learn any moves by TM or HM.`
        }
      </div>
    </div>
  )
}

export default MovesLearned

