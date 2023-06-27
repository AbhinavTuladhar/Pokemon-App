import React from 'react'
import SectionTitle from '../../components/SectionTitle'
import formatName from '../../utils/NameFormatting'

const SpriteTable = ({ data }) => {
  const { pokemonName, spriteCollection } = data

  // Get only those objects which don't have two null values for the sprite Url
  const properSpriteCollection = spriteCollection.filter(obj => {
    const nullUndefinedCount = Object.values(obj).filter(value => value === null || value === undefined).length;
    return nullUndefinedCount <= 1;
  });

  console.log(properSpriteCollection)

  // Vertical headers
  const headers = [
    { generation: 'Type', frontSprite: 'Normal', shinySprite: 'Shiny' }
  ]

  const tableColumns = [...headers, ...properSpriteCollection].map((row, index) => {
    const { generation, frontSprite, shinySprite } = row
    const normalImage = index === 0 ?
      <span className='font-bold'> { frontSprite } </span>
      :
      <img src={frontSprite} alt={pokemonName} className='w-24 h-24' />

    const shinyImage = index === 0 ?
      <span className='font-bold'> { shinySprite } </span>
      :
      <img src={shinySprite} alt={pokemonName} className='w-24 h-24' />

    // Cell data for each column.
    const cellData = [
      { key: 'Generation', value: <span className='font-bold'> { generation } </span> },
      { key: 'Normal Sprite', value: normalImage },
      { key: 'Shiny Sprite', value: shinyImage }
    ]

    // These cells are aligned vertically.
    const tableCells = cellData.map(cell => (
      <div className='flex border border-slate-400 items-center justify-center align-middle text-center h-32 w-32'>
        { cell.value }
      </div>
    )) 

    return (
      <div className='flex flex-col min-h-32 min-w-96'>
        { tableCells }
      </div>
    )
  })

  return (
    <>
      <SectionTitle text={`${formatName(pokemonName)} sprites`} />
        <div className='flex flex-row justify-center items-center'> 
          { tableColumns }
        </div>
    </>
  )
}

export default SpriteTable