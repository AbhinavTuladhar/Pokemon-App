import { React, useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import axios from 'axios'
import formatName from '../../utils/NameFormatting'
import extractMoveInformation from '../../utils/extractMoveInfo'
import TypeCard from '../TypeCard'


const separateMoves = ({ data, learnMethod }) => {
  const movesLearnt = data.map(move => {
    const { version_group_details } = move // this is an array
    const filteredMoves = version_group_details.filter(version => 
      version.move_learn_method.name === learnMethod
    )
    return {
      name: formatName(move.move.name),
      moveURL: move.move.url,
      version_group_details: filteredMoves
    }
  })
  const finalFilteredMoves = movesLearnt.filter(move => move.version_group_details.length > 0)
  return finalFilteredMoves
}

const MovesLearned = ({ data, id }) => {
  const { moves } = data;
  const [moveData, setMoveData] = useState([])
  const [moveInfo, setMoveInfo] = useState({
    level: [],
    machine: [],
    tutor: []
  })
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
    setMoveInfo({
      level: sortedLevelMoves,
      egg: eggMoves,
      machine: machineMoves,
      tutor: tutorMoves
    })
  }, [moveData])

  // Now query the moveURLs to obtain their details
  const fetchData = async (url) => {
    const response = await axios.get(url)
    return response.data
  }

  const { data: moveDetails} = useQuery(
    ['moveDetails', id], 
    () => {
      const levelURLs = moveInfo.level.map(move => move.moveURL)
      return Promise.all(levelURLs.map(fetchData))
    },
  )

  // For extracting information from the move details
  useEffect(() => {
    if (moveDetails?.length > 0) {
      const extracted = moveDetails.map(move => extractMoveInformation(move))
      setFinalMoveDetails(() => {
        const firstRow = {
          moveName: 'Name',
          moveType: 'Type',
          damageClass: 'Class',
          power: "Power",
          accuracy: "Accuracy",
        }
        return [firstRow, ...extracted]
      })
    }
  }, [moveDetails])

  if (finalMoveDetails?.length === 0) return

  const levelUpRow = finalMoveDetails?.map((move, index) => {
    const stringDecoration = index === 0 ? 'font-bold bg-[#1a1a1a]' : ''
    return (
      <div className={`${stringDecoration} flex flex-row gap-x-4 h-12 border border-slate-400 items-center px-4`}>
        <div className='w-4/12'> 
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
          {move.damageClass} 
        </div>
        <div className='w-1/12'> 
          {move.power} 
        </div>
        <div className='w-1/12'> 
          {move.accuracy} 
        </div>
      </div>
    )
  })

  return (
    <div className='test'>
      {levelUpRow}
    </div>
  )
}

export default MovesLearned