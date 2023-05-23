import { React, useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import axios from 'axios'
import formatName from '../../utils/NameFormatting'
import extractMoveInformation from '../../utils/extractMoveInfo'


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
  const [moveInfo, setMoveInfo] = useState({
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
    setMoveInfo({
      level: sortedLevelMoves,
      egg: eggMoves,
      machine: machineMoves,
      tutor: tutorMoves
    })
  }, [moveData])

  // useEffect(() => {
  //   if (moveInfo) console.log(moveInfo)
  // }, [moveInfo])

  // Now query the moveURLs to obtain their details
  const fetchData = async (url) => {
    const response = await axios.get(url)
    return response.data
  }

  const { data: moveDetails} = useQuery(
    'moveDetails', 
    () => {
      const levelURLs = moveInfo.level.map(move => move.moveURL)
      return Promise.all(levelURLs.map(fetchData))
    },
    { enabled: true }
  )

  useEffect(() => {
    if (moveDetails.length > 0) {
      console.log('querying the urls')
      console.log(moveDetails)
      const extracted = moveDetails.map(move => extractMoveInformation(move))
      console.log(extracted)
    }
  }, [moveDetails])

  if (!moveInfo) return

  const levelUpDiv = moveInfo?.level?.map(move => {
    return <div> {move.name} </div>
  })

  return (
    <div className='test'>
      {levelUpDiv}
    </div>
  )
}

export default MovesLearned