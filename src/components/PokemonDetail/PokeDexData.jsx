import { React, useMemo, useEffect, useCallback, useState } from 'react'
import TypeCard from '../TypeCard'
import axios from 'axios'

const PokeDexData = ({ pokemonData }) => {
  const { id, types, genus, height, weight, abilities, pokedex_numbers } = pokemonData
  const [gameData, setGameData] = useState([])
  const [gameDataLoaded, setGameDataLoaded] = useState(false)
  const [regionalData, setRegionalData] = useState([])

  // This is for omitting specific entries in the national number list.
  const excludedRegions = useMemo(() => {
    return ['national', 'conquest-gallery']
  }, [])

  // This is for unit conversion of the height and weight.
  const formattedHeight = `${(height*0.1).toFixed(2)} m`
  const formattedWeight = `${(weight*0.1).toFixed(2)} kg`

  // Change the types into visual form.
  const typeNames = types.map(type => type.type.name)

  // Making a list of all the abilities.
  const abilityNames = abilities.map(ability => {
    const name = ability.ability.name
    const hiddenExtraText = ability.is_hidden === true ? ' (hidden)' : ''
    return name.charAt(0).toUpperCase() + name.slice(1) + hiddenExtraText
  })

  // Now we find the corresponding URLs of the regions.
  // This is for extracting the names of the corresponding games.
  // Omit the national pokedex entry.
  const versionURLs = useMemo(() => {
    const urlList = pokedex_numbers?.filter(entry => !excludedRegions.includes(entry.pokedex.name)).map(entry => entry.pokedex.url)
    return urlList ? urlList : {}
  }, [pokedex_numbers, excludedRegions])

  if (versionURLs) console.log(versionURLs)

  const fetchGameData = useCallback(async () => {
    try {
      const responses = await Promise.all(versionURLs?.map(
        url => axios.get(url)
      ))
      const newData = responses.map(response => response.data)
      setGameData(newData)
      setGameDataLoaded(true)
    } catch (error) {
      console.log(error)
    }
  }, [versionURLs])

  useEffect(() => {
    fetchGameData()
  }, [fetchGameData])

  // Convert the type into its corresponding component.
  const typeDiv = typeNames.map(typeName => <TypeCard typeName={typeName} />)

  // Mkaing an actual list of all the abilities.
  const abilityList = abilityNames.map(ability => <li> {ability} </li>)
  const abilityListFinal = (
    <ol className='list-inside list-decimal'>
      {abilityList}
    </ol>
  )

  // Now dealing with the Pokedex numbers for each region.
  // Omit the national region number ssince it has already been covered.
  const nonNationalValues = pokedex_numbers?.filter(entry => !excludedRegions.includes(entry.pokedex.name))
  const regionNumberValues = nonNationalValues?.map((entry, index) => {
    const regionName = entry.pokedex.name
    const entryNumber = entry.entry_number.toString().padStart(4, '0')
    return { id: index, number: entryNumber, region: regionName }
  })

  // Now combining the regionNumberValues and gameData
  const properGameData = regionNumberValues?.map(obj1 => {
    const obj2 = gameData.find(obj2 => obj2.name === obj1.region)
    return {
      dexNumber: obj1.number,
      gameNames: obj2?.version_groups.map(version => version.name)
    }
  })

  // Now format the text of the properGameData object.
  const finalGameData = properGameData?.map(game => {
    const gameNames = game?.gameNames
    const gameList = gameNames?.map(item => {
      const individualGames = item.split('-').map(game => game.toLowerCase())
      const formattedIndividualGames = individualGames?.map(game =>
        game.charAt(0).toUpperCase() + game.slice(1)  
      )
      const gameListTemp =  formattedIndividualGames?.join(' / ')
      return gameListTemp
    })
    return { dexNumber: game.dexNumber, game: gameList?.join(' / ') }
  })
  
  // This is for rendering tha actual regional pokdex numbers.
  const regionNumberList2 = finalGameData?.map(number => {
    return (
      // This is for the left column
      <div className='flex flex-row'>
        <div className='flex flex-row justify-start w-2/12'>
          { number.dexNumber }
        </div>
        <div className='flex flex-row justify-start w-10/12 brightness-90'>
          { number.game }
        </div>
      </div>
    )
  })
  const regionNumberListFinal2 = (
    <div className='flex flex-col w-full'>
      {regionNumberList2}
    </div>
  )

  // This is for storing the things to be displayed in each row.
  const tableData = [
    { label: 'National no.', value: id},
    { label: 'Type', value: typeDiv },
    { label: 'Species', value: genus },
    { label: 'Height', value: formattedHeight },
    { label: 'Weight', value: formattedWeight },
    { label: 'Abilities', value: abilityListFinal },
    { label: 'Regional no.', value: regionNumberListFinal2 }
  ]

  const tableEntries = tableData.map(row => {
    const spacing = row.label === 'Abilities' || row.label === 'Regional no.'? 'min-h-14' : 'h-12'
    return (
      <div className={`flex flex-row border-t-[1px] border-gray-200 py-2 ${spacing}`}>
        <div className='flex justify-end text-right items-center w-3/12'>
          {row.label}
        </div>
        <div className='flex justify-start pl-4 w-9/12 items-center'>
          {row.value}
        </div>
      </div>
    )
  })

  return (
    <>
      <div className='font-bold text-3xl mb-10'>
        Pokédex data
      </div>
      <div className='flex flex-col border-b-[1px]'>
        {tableEntries}
      </div>
    </>
  )
}

export default PokeDexData;