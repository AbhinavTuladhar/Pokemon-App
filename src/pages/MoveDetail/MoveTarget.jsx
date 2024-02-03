import React from 'react'
import SectionTitle from '../../components/SectionTitle'
import Skeleton from 'react-loading-skeleton'
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
    targetedStyle = 'text-black'
  }

  return (
    <div
      className={`flex h-14 w-24 flex-row items-center justify-center rounded-l-2xl rounded-r-2xl ${backgroundStyle} ${targetedStyle}`}
    >
      {text}
    </div>
  )
}

const MoveTarget = ({ targetType }) => {
  const targetInformation = buildMoveTargetData(targetType)

  const { allyInformation, description, foeInformation } = targetInformation

  return (
    <>
      <SectionTitle text="Move Targets" />
      {targetType ? (
        <>
          <div className="mx-6 flex flex-col items-center gap-y-2">
            <div className="flex flex-row gap-x-2">
              {foeInformation.map((box, index) => (
                <PokemonTargetBox
                  flag={box.flag}
                  text={box.text}
                  targeted={box.targeted}
                  key={index}
                />
              ))}
            </div>
            <div className="flex flex-row gap-x-2">
              {allyInformation.map((box, index) => (
                <PokemonTargetBox
                  flag={box.flag}
                  text={box.text}
                  targeted={box.targeted}
                  key={index}
                />
              ))}
            </div>
          </div>
          <p className="mt-4 w-full text-center italic"> {description}</p>
        </>
      ) : (
        <Skeleton className="h-40" containerClassName="flex flex-1" />
      )}
    </>
  )
}

export default MoveTarget
