import { React, useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import { useQuery } from 'react-query'
import Skeleton from 'react-loading-skeleton'
import fetchData from '../../utils/fetchData'
import TypeCard from '../../components/TypeCard'
import SectionTitle from '../../components/SectionTitle'
import TableContainer from '../../components/TableContainer'
import OneLineSkeleton from '../../components/OneLineSkeleton'
import formatName from '../../utils/NameFormatting'

const PokeDexData = ({ pokemonData }) => {
  const { types, genus, height, weight, abilities, pokedex_numbers, nationalNumber } = pokemonData

  const formattedNationalNumber = `${'00' + nationalNumber}`.slice(-3)

  /*
  This is for omitting entries for national dex and conquest gallery.
  */
  const excludedRegions = useMemo(() => {
    return ['national', 'conquest-gallery']
  }, [])

  // This is for unit conversion of the height and weight.
  const formattedHeight = `${(height*0.1).toFixed(2)} m`
  const formattedWeight = `${(weight*0.1).toFixed(2)} kg`

  // Change the types into visual form.
  const typeNames = types.map(type => type.type.name)

  // Now we find the corresponding URLs of the regions.
  // This is for extracting the names of the corresponding games.
  // Omit the national and conquest gallery pokedex entries.
  const versionURLs = useMemo(() => {
    const urlList = pokedex_numbers?.filter(entry => !excludedRegions.includes(entry.pokedex.name)).map(entry => entry.pokedex.url)
    return urlList ? urlList : {}
  }, [pokedex_numbers, excludedRegions])

  // This is for fetching the names of the games.
  const { data: gameData = [], isLoading } = useQuery(
    [nationalNumber],
    () => Promise.all(versionURLs?.map(fetchData)),
    { staleTime: Infinity, cacheTime: Infinity }
  )

  // Convert the types of the Pokemon into its corresponding component.
  const typeDiv = typeNames.map(typeName => <TypeCard typeName={typeName} />)

  // Making an actual list of all the abilities.
  const abilityList = abilities.map((ability, index) => {
    const name = ability.ability.name
    const prefix = ability.is_hidden === true ? '' : `${index+1}. ` 
    const hiddenExtraText = ability.is_hidden === true ? ' (hidden ability)' : ''
    return (
      <li key={index}> 
        <> {prefix} </>
        <NavLink to={`/ability/${name}`} className='text-blue-400 hover:text-red-400 hover:underline duration-300'>
          { formatName(name) }
        </NavLink>
        <> { hiddenExtraText } </>
      </li>
    )
  })
  const abilityListFinal = (
    <ol className='list-inside list-none'>
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
    const obj2 = gameData?.find(obj2 => obj2.name === obj1.region)
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
    { label: 'National no.', value: formattedNationalNumber},
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
            { row.value }
          </div>
        </div>
      </div>
    )
  })

  const skeletonRows = Array(8).fill(0).map(row => (
    <Skeleton width='100%' height='2.75rem' containerClassName='flex-1 w-full' />
  ))

  const loadingDiv = (
    <div className='flex flex-col'>
      { skeletonRows }
    </div>
  )

  return (
    <>
      <SectionTitle text={'Pokédex data'} />
      { 
        isLoading 
        ?
        loadingDiv
        :
        <TableContainer child={tableEntries} />
      }
    </>
  )
}

export default PokeDexData;