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

const firstRow = {
  moveName: 'Name',
  moveType: 'Type',
  damageClass: 'Class',
  power: "Power",
  accuracy: "Acc.",
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

// This is just a simple component only to properly encapsulate tabular data.
const TableContainer = ( { child }) => {
  return (
    <div className='border-b-[1px] border-slate-400'>
        {child}
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
  const [moveData, setMoveData] = useState([])
  const [finalMoveDetails, setFinalMoveDetails] = useState([])

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
    setMoveURLs({
      level: sortedLevelMoves?.map(move => move.moveURL),
      machine: machineMoves?.map(move => move.moveURL),
      egg: eggMoves?.map(move => move.moveURL),
      tutor: tutorMoves?.map(move => move.moveURL),
    })
    // setMoveInfo({
    //   level: sortedLevelMoves,
    //   egg: eggMoves,
    //   machine: machineMoves,
    //   tutor: tutorMoves
    // })
  }, [moveData])

  useEffect(() => {
    if (moveURLs) {
      console.log('printing move urls')
      console.log(moveURLs)
    }
  }, [moveURLs])

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
      return {
        level: [firstRow, ...levelExtracted],
        tutor: [firstRow, ...tutorExtracted],
        machine: [firstRow, ...machineExtracted],
        egg: [firstRow, ...eggExtracted]
      }
    })
  }, [levelMoveDetails, tutorMoveDetails, machineMoveDetails, eggMoveDetails])
  
  useEffect(() => {
    if (finalMoveDetails) {
      console.log('printing final move details')
      console.log(finalMoveDetails)
    }
  }, [finalMoveDetails])

  // if (finalMoveDetails?.length === 0) return

  // Return a tabular form of the levelup, machine, egg and tutor moves data.
  const returnMoveTable = data => {
    return data?.map((move, index) => {
      const stringDecoration = index === 0 ? 'font-bold bg-[#1a1a1a]' : 'hover:bg-gray-700'
      const moveClassImage = returnMoveImage(move.damageClass)
  
      return (
        <div className={`${stringDecoration} flex flex-row gap-x-4 h-12 border-t-[1px] border-slate-400 items-center px-4`}>
          <div className='w-3/12'> 
            {formatName(move.moveName)} 
          </div>
          <div className='w-2/12'>
            {
              index === 0 ? 
              'Type' :
              <TypeCard typeName={move.moveType} />
            }
          </div>
          <div className='w-1/12'> 
            {
              moveClassImage === '' 
              ?
              move.damageClass
              :
              <img className='w-[30px] h-[20px]' src={moveClassImage} alt={move.damageClass} />
            }
          </div>
          <div className='w-1/12 justify-end flex'> 
            {move.power} 
          </div>
          <div className='w-1/12 justify-end flex'> 
            {move.accuracy} 
          </div>
        </div>
      )
    })
  }

  const levelUpTable = returnMoveTable(finalMoveDetails?.level)
  const tutorTable = returnMoveTable(finalMoveDetails?.tutor)
  const machineTable = returnMoveTable(finalMoveDetails?.machine)
  const eggTable = returnMoveTable(finalMoveDetails?.egg)

  return (
    <div className='flex flex-row justify-between w-full flex-wrap'>
      <div className='flex flex-col w-475/1000 md:w-475/1000 sm:w-full'>
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
      <div className='flex flex-col w-475/1000 md:w-475/1000 sm:w-full'>
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