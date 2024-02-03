import React from 'react'
import formatName from '../../utils/NameFormatting'
import OneLineSkeleton from '../../components/OneLineSkeleton'

const TypeDetailCard = ({ moveList, pokemonList, typeName }) => {
  const moveCount = moveList?.length

  const pokemonCount = pokemonList?.length

  // Now include only the Pokemon + their forms up to generation 7 only.
  // const pokemonCount = pokemonList
  //   ?.map((url) => {
  //     const idNumber = url.match(/\/(\d+)\/$/)[1]
  //     return parseInt(idNumber)
  //   })
  //   ?.filter((id) => id <= 10157)?.length

  return (
    <section className="mb-3 mt-6 flex flex-row flex-wrap justify-center gap-x-20 gap-y-10">
      <div className="flex w-40 flex-col items-center justify-center rounded-lg border border-slate-500 p-2 text-center">
        <span className="text-2xl font-bold">{pokemonCount || <OneLineSkeleton />}</span>
        <span className="text-sm"> {formatName(typeName)} type Pokémon </span>
      </div>

      <div className="flex w-40 flex-col items-center justify-center rounded-lg border border-slate-500 p-2 text-center">
        <span className="text-2xl font-bold">{moveCount || <OneLineSkeleton />}</span>
        <span className="text-sm"> {formatName(typeName)} type moves </span>
      </div>
    </section>
  )
}

export default TypeDetailCard
