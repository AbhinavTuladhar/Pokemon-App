import { React, useState } from 'react'

const ImageTile = ({ imageSources }) => {
  const [selectedImage, setSelectedImage] = useState('normal')
  const { defaultSprite, shinySprite } = imageSources;

  // These are for detecting and hence styling the selected and unselected buttons.
  const imageSrc = selectedImage === 'normal' ? defaultSprite : shinySprite
  const selectedButtonStyle = 'text-black bg-white w-24 py-0 px-4 rounded-3xl border duration-300'
  const unselectedButtonStyle = 'text-white bg-black w-24 py-0 px-4 rounded-3xl border duration-300'

  // For toggling between normal and shiny versions.
  const handleClick = () => {
    setSelectedImage(prevStatus => {
      return prevStatus === 'normal' ? 'shiny' : 'normal'
    })
  }

  return (
    <div className='flex flex-col mt-5'>
      <div className='flex flex-row justify-center my-2 gap-x-4'>
        <button
          className={selectedImage === 'normal' ? selectedButtonStyle : unselectedButtonStyle}
          onClick={handleClick}
        >
          Normal
        </button>
        <button
          className={selectedImage === 'normal' ? unselectedButtonStyle : selectedButtonStyle}
          onClick={handleClick}
        >
          Shiny
        </button>
      </div>
      <div className='flex flex-row justify-center'>
        <img src={imageSrc} className='min-h-[400px] w-auto object-center' alt={'pokemon'} />
      </div>
    </div>
  )
}

export default ImageTile;