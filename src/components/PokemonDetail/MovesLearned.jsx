import { React, useState, useEffect } from 'react'
import formatName from '../../utils/NameFormatting'

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

const MovesLearned = ({ data }) => {
  const { moves } = data;
  const [moveData, setMoveData] = useState([])
  const [moveDetails, setMoveDetails] = useState({
    level: [],
    machine: [],
    tutor: []
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
    setMoveDetails({
      level: sortedLevelMoves,
      egg: eggMoves,
      machine: machineMoves,
      tutor: tutorMoves
    })
  }, [moveData])

  useEffect(() => {
    if (moveDetails) console.log(moveDetails)
  }, [moveDetails])

  if (!moveDetails) return

  const levelUpDiv = moveDetails?.level?.map(move => {
    return <div> {move.name} </div>
  })

  return (
    <div className='test'>
      {levelUpDiv}
    </div>
  )
}

export default MovesLearned