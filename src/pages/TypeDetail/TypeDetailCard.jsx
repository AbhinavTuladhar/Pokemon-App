import React from 'react'
import formatName from '../../utils/NameFormatting'
import OneLineSkeleton from '../../components/OneLineSkeleton'

const TypeDetailCard = ({ moveList, pokemonList, typeName }) => {
  const moveCount = moveList?.length

  // Now include only the Pokemon + their forms up to generation 7 only.
  const pokemonCount = pokemonList
    ?.map((url) => {
      const idNumber = url.match(/\/(\d+)\/$/)[1]
      return parseInt(idNumber)
    })
    ?.filter((id) => id <= 10157)?.length

  return (
    <section className="flex flex-row flex-wrap justify-center mt-6 mb-3 gap-x-20 gap-y-10">
      <div className="w-40 text-center flex flex-col items-center justify-center border rounded-lg border-slate-500 p-2">
        <span className="text-2xl font-bold">{pokemonCount || <OneLineSkeleton />}</span>
        <span className="text-sm"> {formatName(typeName)} type Pokémon </span>
      </div>

      <div className="w-40 text-center flex flex-col items-center justify-center border rounded-lg border-slate-500 p-2">
        <span className="text-2xl font-bold">{moveCount || <OneLineSkeleton />}</span>
        <span className="text-sm"> {formatName(typeName)} type moves </span>
      </div>
    </section>
  )
}

export default TypeDetailCard
