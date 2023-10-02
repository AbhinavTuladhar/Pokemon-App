import React from 'react'
import SectionTitle from '../../components/SectionTitle'
import formatName from '../../utils/NameFormatting'

const SpriteTable = ({ data }) => {
  const { pokemonName, spriteCollection } = data

  /* 
  Get only those objects which don't have two null values for the sprite Url
  Generation 1 has no shiny sprite, hence the threshold.
  Sprites for the generation below the generation the pokemon was introduced in are ommitted.
  Gen 6+ pokemon have gen 5-like sprites, as stated in the documentation.
  */
  const properSpriteCollection = spriteCollection.filter(obj => {
    const nullUndefinedCount = Object.values(obj).filter(value => value === null || value === undefined).length;
    return nullUndefinedCount <= 1;
  });

  // Vertical headers
  const headers = [
    { generation: 'Type', frontSprite: 'Normal', shinySprite: 'Shiny' }
  ]

  const tableColumns = [...headers, ...properSpriteCollection].map((row, index) => {
    const { generation, frontSprite, shinySprite } = row
    const columnWidth = index === 0 ? 'w-24' : 'w-40'
    const normalImage = index === 0 ?
      <span className='font-bold'> {frontSprite} </span>
      :
      <img src={frontSprite} alt={pokemonName} className='w-36 h-36' />

    const shinyImage = index === 0 ?
      <span className='font-bold'> {shinySprite} </span>
      :
      // For non-existent generation 1 shiny sprites and shiny icons
      ['Generation 1', 'Icon'].includes(generation)
        ?
        <span className='text-3xl font-bold'> — </span>
        :
        <img src={shinySprite} alt={pokemonName} className='w-36 h-36' />

    // Cell data for each column.
    const cellData = [
      { key: 'Generation', value: <span className='font-bold'> {generation} </span> },
      { key: 'Normal Sprite', value: normalImage },
      { key: 'Shiny Sprite', value: shinyImage }
    ]

    // These cells are aligned vertically.
    const tableCells = cellData.map((cell, cellIndex) => {
      const cellStyle = cellIndex === 0 ? 'h-16 bg-gray-900' : 'h-48'
      return (
        <div className={`${cellStyle} object-center flex border border-slate-400 items-center justify-center align-middle text-center h-16 min-h-32 ${columnWidth}`}>
          {cell.value}
        </div>
      )
    })

    return (
      <div className='flex flex-col'>
        {tableCells}
      </div>
    )
  })

  return (
    <>
      <SectionTitle text={`${formatName(pokemonName)} sprites`} />
      <div className='flex items-center justify-center'>
        <div className='overflow-auto'>
          <div className='inline-flex'>
            {tableColumns}
          </div>
        </div>
      </div>
    </>
  )
}

export default SpriteTable