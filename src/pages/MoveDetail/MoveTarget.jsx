import React from 'react'
import SectionTitle from '../../components/SectionTitle'
import { buildMoveTargetData } from '../../utils/buildMoveTargetData'

const PokemonTargetBox = ({ text, flag, targeted }) => {
  let backgroundStyle
  let targetedStyle
  if (flag === 'ally') {
    backgroundStyle = 'bg-cyan-400 '
  } else {
    backgroundStyle = 'bg-orange-400'
  }

  if (targeted) {
    targetedStyle = 'border-green-700 border-4 text-white'
  } else {
    targetedStyle = "text-black"
  }

  return (
    <div className={`flex flex-row justify-center items-center h-14 w-24 rounded-l-2xl rounded-r-2xl ${backgroundStyle} ${targetedStyle}`}>
      {text}
    </div>
  )
}

const MoveTarget = ({ targetType }) => {
  const targetInformation = buildMoveTargetData(targetType)

  const { allyInformation, description, foeInformation } = targetInformation

  return (
    <div>
      <SectionTitle text='Move Targets' />
      <div className='flex flex-col items-center gap-y-2 mx-6'>
        <div className='flex flex-row gap-x-2'>
          {foeInformation.map((box, index) => (
            <PokemonTargetBox flag={box.flag} text={box.text} targeted={box.targeted} key={index} />
          ))}
        </div>
        <div className='flex flex-row gap-x-2'>
          {allyInformation.map((box, index) => (
            <PokemonTargetBox flag={box.flag} text={box.text} targeted={box.targeted} key={index} />
          ))}
        </div>
      </div>
      <p className='text-center w-full mt-4 italic'> {description}</p>
    </div>
  )
}

export default MoveTarget