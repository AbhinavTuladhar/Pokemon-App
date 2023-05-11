import { React, useState} from 'react'

const ImageTile = ({ imageSources }) => {
  const [selectedImage, setSelectedImage] = useState('normal')
  const { defaultSprite, shinySprite } = imageSources;

  const imageSrc = selectedImage === 'normal' ? defaultSprite : shinySprite
  const selectedButtonStyle = 'text-black bg-white w-24 py-0 px-4 rounded-3xl border duration-300'
  const unselectedButtonStyle = 'text-white bg-black w-24 py-0 px-4 rounded-3xl border duration-300'

  const handleClick = () => {
    setSelectedImage(prevStatus => {
      return prevStatus === 'normal' ? 'shiny' : 'normal'
    })
  }
  
  return (
    <div className='flex flex-col'>
      <div className='flex flex-row gap-x-4 justify-center my-2'>
        <button 
          className={selectedImage === 'normal' ? selectedButtonStyle : unselectedButtonStyle }
          onClick={handleClick}
        >
           Normal
        </button>
        <button 
          className={selectedImage === 'normal' ? unselectedButtonStyle : selectedButtonStyle }
          onClick={handleClick}
        >
           Shiny
        </button>
      </div>
      <div className='flex flex-row justify-center'>
        <img src={imageSrc} className='min-h-full' />
      </div>
    </div>
  )
}

export default ImageTile;