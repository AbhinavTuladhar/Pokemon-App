import React from 'react'
import { useQuery } from 'react-query'
import axios from 'axios'
import { NavLink } from 'react-router-dom'
import TypeCard from '../../components/TypeCard'
import SectionTitle from '../../components/SectionTitle'
import TableContainer from '../../components/TableContainer'
import formatName from '../../utils/NameFormatting'
import { extractMoveInformation } from '../../utils/extractInfo'
import { FadeInAnimationContainer } from '../../components/AnimatedContainers'
import movePhysical from '../../images/move-physical.png'
import moveSpecial from '../../images/move-special.png'
import moveStatus from '../../images/move-status.png'
import '../../index.css'

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

// This is for filtering out the moves on depending on how it is learnt - only for SM.
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

const MovesLearned = ({ data }) => {
  const { moves, name: pokemonName } = data;
  const properPokemonName = formatName(pokemonName)

  // Consider that the latest gen is 7.
  const SMData = moves?.flatMap(move => {
    const { version_group_details } = move
    const SMInfo = version_group_details.filter(version =>
      version.version_group.name === 'ultra-sun-ultra-moon'
    )
    return {
      ...move,
      version_group_details: SMInfo
    }
  })

  // Filter out the details in the version group details array is empty
  const finalSMData = SMData.filter(move => move.version_group_details.length > 0)
  const moveData = finalSMData

  // This is for separating out the moves learnt by level up, TM/HM and by breeding.
  const levelUpMoves = separateMoves({ data: moveData, learnMethod: 'level-up' })
  const machineMoves = separateMoves({ data: moveData, learnMethod: 'machine' })
  const eggMoves = separateMoves({ data: moveData, learnMethod: 'egg' })
  const tutorMoves = separateMoves({ data: moveData, learnMethod: 'tutor' })

  // Now sort the moves by some conditions.
  // sort level up moves by the level learnt.
  const sortedLevelMoves = levelUpMoves.sort((curr, next) => {
    const levelLearntCurrent = curr.version_group_details[curr.version_group_details.length - 1].level_learned_at
    const levelLearntNext = next.version_group_details[next.version_group_details.length - 1].level_learned_at
    if (levelLearntCurrent < levelLearntNext)
      return -1
    else if (levelLearntCurrent > levelLearntNext)
      return 1
    else
      return (curr.name < next.name ? -1 : 1)
  })

  // Extract the move name and the level learnt for the moves learn by level up.
  const levelLearntData = levelUpMoves?.map(move => {
    return {
      name: move.name,
      levelLearntAt: move.version_group_details[move.version_group_details.length - 1].level_learned_at
    }
  })

  const moveUrls = {
    level: sortedLevelMoves?.map(move => move.moveURL),
    machine: machineMoves?.map(move => move.moveURL),
    egg: eggMoves?.map(move => move.moveURL),
    tutor: tutorMoves?.map(move => move.moveURL),
  }

  // Now query the moveURLs to obtain their details
  const fetchData = async (urls) => {
    const responses = await Promise.all(urls.map(url => axios.get(url)));
    return responses.map(response => response.data);
  }

  const transformMoveData = data => {
    return data.map(move => extractMoveInformation(move))
  }

  const { data: levelMoveDetails, isLoading: isLoadingLevel } = useQuery(
    ['levelDetails', moveUrls.level],
    () => fetchData(moveUrls.level),
    { enabled: true, staleTime: Infinity, cacheTime: Infinity, select: transformMoveData }
  )

  const { data: tutorMoveDetails, isLoading: isLoadingTutor } = useQuery(
    ['tutorDetails', moveUrls.tutor],
    () => fetchData(moveUrls.tutor),
    { enabled: true, staleTime: Infinity, cacheTime: Infinity, select: transformMoveData }
  )

  const { data: machineMoveDetails, isLoading: isLoadingMachine } = useQuery(
    ['machineDetails', moveUrls.machine],
    () => fetchData(moveUrls.machine),
    { enabled: true, staleTime: Infinity, cacheTime: Infinity, select: transformMoveData }
  )

  const { data: eggMoveDetails, isLoading: isLoadingEgg } = useQuery(
    ['eggDetails', moveUrls.egg],
    () => fetchData(moveUrls.egg),
    { enabled: true, staleTime: Infinity, cacheTime: Infinity, select: transformMoveData }
  )

  if (isLoadingLevel || isLoadingTutor || isLoadingMachine || isLoadingEgg) {
    return
  }

  const combinedLevelDetails = levelLearntData?.map(obj1 => {
    const obj2 = levelMoveDetails?.find(obj => obj?.moveName === obj1?.name)
    return { ...obj1, ...obj2 }
  })

  const finalMoveDetails = {
    level: [firstRowLevelUp, ...combinedLevelDetails],
    tutor: [firstRow, ...tutorMoveDetails],
    machine: [firstRow, ...machineMoveDetails],
    egg: [firstRow, ...eggMoveDetails]
  }

  // Return a tabular form of the levelup, machine, egg and tutor moves data.
  const returnMoveTable = data => {
    return data?.map((move, index) => {
      // Darken the first row, else create a hover effect
      const stringDecoration = index === 0 ? 'font-bold bg-[#1a1a1a]' : ''
      // For the damage class image
      const moveClassImage = returnMoveImage(move?.damageClass)
      // Check if it is the first column.
      const firstColStyle = move?.levelLearntAt ? '' : 'pl-4'
      // Different colour for the move name column
      const moveNameStyle = index === 0 ? '' : 'font-bold hoverable-link hover:cursor-pointer'
      // For zebra pattern
      const rowBg = index !== 0 && index % 2 === 0 ? 'bg-gray-900' : ''
      return (
        <div className={`${stringDecoration} ${rowBg} table-row border-[1px] border-slate-400`} key={index}>
          {
            move.levelLearntAt &&
            <div className='pl-4 table-cell align-middle h-12 border-t-[1px] border-slate-400 px-2'>
              {move?.levelLearntAt}
            </div>
          }
          <div className={`${firstColStyle} ${moveNameStyle} whitespace-nowrap table-cell align-middle h-12 border-t-[1px] border-slate-400 px-2 `}>
            {
              index !== 0
                ?
                <NavLink to={`/moves/${move?.moveName}`}> {formatName(move?.moveName)} </NavLink>
                :
                formatName(move?.moveName)
            }
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

  return (
    <div className='flex flex-row flex-wrap justify-between w-full'>
      <div className='flex flex-col w-full lg:w-475/1000'>
        <SectionTitle text={'Moves learnt by level up'} />
        {finalMoveDetails?.level?.length > 1 ? (
          <>
            <span className='mb-4'>
              {`${properPokemonName} learns the following moves in generation 7 at the levels specified.`}
            </span>
            <FadeInAnimationContainer>
              <TableContainer child={levelUpTable} />
            </FadeInAnimationContainer>
          </>
        ) :
          `${properPokemonName} does not learn any moves by level up`
        }

        <SectionTitle text={'Moves learnt by tutor'} />
        {finalMoveDetails?.tutor?.length > 1 ? (
          <>
            <span className='mb-4'>
              {`${properPokemonName} can be taught the following moves in generation 7 by move tutors.`}
            </span>
            <FadeInAnimationContainer>
              <TableContainer child={tutorTable} />
            </FadeInAnimationContainer>
          </>
        ) :
          `${properPokemonName} does not learn any move taught by a tutor.`
        }
        <SectionTitle text={'Moves learnt by Breeding'} />
        {finalMoveDetails?.egg?.length > 1 ? (
          <>
            <span className='mb-4'>
              {`${properPokemonName} learns the following moves in generation 7 by breeding.`}
            </span>
            <FadeInAnimationContainer>
              <TableContainer child={eggTable} />
            </FadeInAnimationContainer>
          </>
        ) :
          `${properPokemonName} does not learn any moves by breeding.`
        }
      </div>
      <div className='flex flex-col w-full lg:w-475/1000'>
        <SectionTitle text={'Moves learnt by HM/TM'} />
        {finalMoveDetails?.machine?.length > 1 ? (
          <>
            <span className='mb-4'>
              {`${properPokemonName} is compatible with these Technical Machines in Generation 7:`}
            </span>
            <FadeInAnimationContainer>
              <TableContainer child={machineTable} />
            </FadeInAnimationContainer>
          </>
        ) :
          `${properPokemonName} does not learn any moves by TM or HM.`
        }
      </div>
    </div>
  )
}

export default MovesLearned

