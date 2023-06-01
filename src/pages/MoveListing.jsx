import { React, useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { useQuery } from 'react-query'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import TableContainer from '../components/TableContainer'
import extractMoveInformation from '../utils/extractMoveInfo'
import formatName from '../utils/NameFormatting'
import TypeCard from '../components/TypeCard'
import movePhysical from '../images/move-physical.png'
import moveSpecial from '../images/move-special.png'
import moveStatus from '../images/move-status.png'

// For damage class image.
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

const MoveListing = () => {
  const [ moveList, setMoveList ] = useState([])
  const [ moveListReady, setMoveListReady ] = useState([])
  const [ TMURLs, setTMURLs ] = useState([])
  const [ TMData, setTMData ] = useState([])

  // For changing the page title.
  const location = useLocation()
  useEffect(() => {
    document.title = 'Move List'
  }, [location])

  // This fetches the URLs of all the moves
  const urlList = useMemo(() => {
    let urls = []
    // default is 621
    for (let i = 1; i <= 621; i++) {
      urls.push(`https://pokeapi.co/api/v2/move/${i}/`)
    }
    return urls
  }, [])

  // For fetching data from a url.
  const fetchData = async (url) => {
    const response = await axios.get(url)
    return response.data
  }

  // Perform a GET request on all the 'calculated' URLs.
  const { data: moveData } = useQuery(
    ['moveData', urlList],
    () => Promise.all(urlList.map(fetchData)),
    { staleTime: Infinity, cacheTime: Infinity }
  )

  useEffect(() => {
    if (!moveData)
      return
    const extracted = moveData.map(move => extractMoveInformation(move))
    setMoveList(() => {
      const extractedNew = extracted.map(move => {
        const { id, moveName, moveType, damageClass, power, accuracy, PP, shortEntry, effect_chance: effectChance, machines } = move
        return { id, moveName, moveType, damageClass, power, accuracy, PP, shortEntry, effectChance, machines }
      })
      // sorting alphabetically
      return extractedNew.sort((prev, curr) => prev.moveName > curr.moveName ? 1 : -1)
    })
    }, [moveData])

  // Find the tm.
  useEffect(() => {
    if (!moveList)
      return
    const tmURLs = moveList?.map(move => {
      const ORASEntry = move?.machines.find(obj => obj.version_group.name === 'omega-ruby-alpha-sapphire')
      return {
        moveName: move.moveName,
        url: ORASEntry?.machine?.url
      }
    })
    setTMURLs(tmURLs)
  }, [moveList])

  // Now query the urls.
  const { data: TMResponse } = useQuery(
    ['TMList', TMURLs],
    () => {
      const availableURLs = TMURLs?.filter(machine => machine.url !== undefined)
      const TMURLList = availableURLs?.map(machine => machine.url)
      return Promise.all(TMURLList.map(fetchData))
    },
    { staleTime: Infinity, cacheTime: Infinity }
  )

  // Now make an array of objects - the object has two keys - 
  // name: name of the machine, machine: Machine number, like HM01, TM23
  useEffect(() => {
    if (!TMResponse) {
      return;
    }

    const formattedData = TMResponse.map(move => {
      // Reformat the TM number.
      const TMNumber = move.item.name
      const formattedTM = TMNumber.slice(0, 2).toUpperCase() + TMNumber.slice(2)
      return {
        name: move.move.name,
        machine: formattedTM
      }
    });

    setTMData(formattedData);
  }, [TMResponse]);

  // Now join TMdata and MOveList on the basis of the move name and set the result to moveListReady.
  useEffect(() => {
    if (!moveList && !TMData)
      return
    
    const joinedData = moveList?.map(obj1 => {
      const obj2 = TMData?.find(obj => obj1.moveName === obj.name) 
      return { ...obj1, ...obj2 }
    })

    setMoveListReady(joinedData)
  }, [TMData, moveList])

  const headers = [{
    moveName: 'Name',
    moveType: 'Type',
    damageClass: 'Cat.',
    power: 'Power',
    accuracy: 'Acc.',
    PP: 'PP',
    machine: 'TM',
    shortEntry: 'Effect',    
    effectChance: 'Prob. (%)'
  }]

  const moveTableRows = [...headers, ...moveListReady].map((move, index) => {
    const { id, moveName, moveType, damageClass, power, accuracy, machine, PP, shortEntry, effectChance } = move
    const link = `/moves/${id}`
    // Provide a border on all sides and bold the text for the header.
    const headerStyle = index === 0 ? 'font-bold' : ''
    // Separate background colours for the header and odd-even rows.
    let bgColour
    if (index !== 0 && index % 2 === 0) {
      bgColour = 'bg-gray-900'
    } else if (index === 0) {
      bgColour = 'bg-[#1a1a1a]'
    } else {
      bgColour = ''
    }
    // An image for the move type.
    const moveClassImage = returnMoveImage(damageClass)
    // Creating an object for the table cells, abiding by the DRY principle.
    const tableCellData = [
      { 
        key: 'moveName', 
        value: (
          <NavLink to={link}> {formatName(moveName)} </NavLink> 
        ),
        style: index !== 0 ? 'text-blue-400 font-bold hover:text-red-500 hover:underline duration-300 whitespace-nowrap' : ''
      },
      { 
        key: 'moveType', 
        value: index === 0 ? moveType : <TypeCard typeName={ moveType } /> 
      },
      { 
        key: 'damageClass', 
        value: index === 0 ? damageClass : <img src={moveClassImage} className='h-[20px] w-[30px]' alt={damageClass} /> 
      },
      { 
        key: 'power', 
        value: power 
      },
      { 
        key: 'accuracy', 
        value: accuracy 
      },
      { 
        key: 'PP', 
        value: PP 
      },
      { 
        key: 'machine', 
        value: machine 
      },
      { 
        key: 'shortEntry', 
        value: (<div className='w-[36rem]'> { shortEntry?.replace('$effect_chance% ', '') } </div>),
        style: 'pr-8 w-[48rem]'
      },
      { 
        key: 'effectChance', 
        value: effectChance ,
        style: 'whitespace-nowrap'
      },
    ];
    const tableCells = tableCellData.map(cell => {
      return (
        <div 
          className={`${cell.style} ${headerStyle} ${bgColour} border-gray-500 border-t-[1px] table-cell h-12 align-middle p-2`}
        > 
          { cell.value }
        </div>
      )
    })
    return (
      <div className='table-row hover:brightness-110'>
        { tableCells }
      </div>
    )
  }) 

  const loadingDiv =  (
    <div className='flex text-center items-center justify-center text-3xl'> 
      Loading. It might take some time since there are 621 moves! 
    </div>
  )

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transitionDuration: '0.8s' }}
      exit={{ opacity: 0, transitionDuration: '0.75s' }}
      className='mx-4'
    >
      { 
        // Checking if data is present
        (moveTableRows?.length < 2 && TMData.length === 0) 
        ?
        loadingDiv
        :
        <TableContainer child={moveTableRows} />
      }
    </motion.div>
  )
}

export default MoveListing