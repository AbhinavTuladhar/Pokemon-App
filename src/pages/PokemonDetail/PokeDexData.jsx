import { React, useMemo, useEffect, useCallback, useState } from 'react'
import axios from 'axios'
import TypeCard from '../../components/TypeCard'
import SectionTitle from '../../components/SectionTitle'
import TableContainer from '../../components/TableContainer'

const PokeDexData = ({ pokemonData }) => {
  const { id, types, genus, height, weight, abilities, pokedex_numbers } = pokemonData
  const [gameData, setGameData] = useState([])

  /*
  This is for omitting entries for national dex and conquest gallery.
  Reasoning: national number is equivalent to the id.
  Conquest gallery doesn't have a game name.
  */
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
  // Omit the national and conquest gallery pokedex entries.
  const versionURLs = useMemo(() => {
    const urlList = pokedex_numbers?.filter(entry => !excludedRegions.includes(entry.pokedex.name)).map(entry => entry.pokedex.url)
    return urlList ? urlList : {}
  }, [pokedex_numbers, excludedRegions])

  // This is for fetching the names of the games.
  const fetchGameData = useCallback(async () => {
    try {
      const responses = await Promise.all(versionURLs?.map(
        url => axios.get(url)
      ))
      const newData = responses.map(response => response.data)
      setGameData(newData)
    } catch (error) {
      console.log(error)
    }
  }, [versionURLs])

  useEffect(() => {
    fetchGameData()
  }, [fetchGameData])

  // Convert the types of the Pokemon into its corresponding component.
  const typeDiv = typeNames.map(typeName => <TypeCard typeName={typeName} />)

  // Making an actual list of all the abilities.
  const abilityList = abilityNames.map((ability, index) => <li key={index}> {ability} </li>)
  const abilityListFinal = (
    <ol className='list-inside list-decimal'>
      {abilityList}
    </ol>
  )

  // Now dealing with the Pokedex numbers for each region.
  // Omit the national region number and conquest gallery numbers, for the reasons specified before.
  const nonNationalValues = pokedex_numbers?.filter(entry => !excludedRegions.includes(entry.pokedex.name))
  const regionNumberValues = nonNationalValues?.map((entry, index) => {
    const regionName = entry.pokedex.name
    const entryNumber = entry.entry_number.toString().padStart(4, '0')
    return { id: index, number: entryNumber, region: regionName }
  })

  /*
  Now combining the regionNumberValues and gameData.
  This will combine two objects: one object contains the name of the region, while the other contains the name of the games.
  */
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

  const regionNumberList = finalGameData?.map(number => {
    return (
      <div className='table-row'>
        <div className='table-cell px-1'>
          { number.dexNumber }
        </div>
        <div className='table-cell px-1 brightness-90'>
          { number.game }
        </div>
      </div>
    )
  })
  const regionNumberListFinal = (
    <div className='table'>
      {regionNumberList}
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
    { label: 'Regional no.', value: regionNumberListFinal }
  ]

  // Now define the JSX component for all the entries.
  const tableEntries = tableData.map(row => {
    const spacing = row.label === 'Abilities' || row.label === 'Regional no.'? 'min-h-14' : 'h-12'
    return (
      <div className={`table-row border-t-[1px] border-gray-200 py-2 ${spacing}`}>
        <div className='table-cell align-middle py-2 border-t-[1px] border-gray-200 text-right w-3/12'>
          {row.label}
        </div>
        <div className='table-cell align-middle py-2 border-t-[1px] border-gray-200 pl-4 w-9/12'>
          <div className="flex">
            {row.value}
          </div>
        </div>
      </div>
    )
  })

  return (
    <>
      <SectionTitle text={'Pokédex data'} />
      <TableContainer child={tableEntries} />
    </>
  )
}

export default PokeDexData;