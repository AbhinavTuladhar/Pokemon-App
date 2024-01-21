const multiplierToString = (value) => {
  switch (value) {
    case 1:
      return 'normal effectiveness'
    case 0.25:
    case 0.5:
      return 'not very effective'
    case 2:
    case 4:
      return 'super-effective'
    case 0:
      return 'no effect'
    default:
      return 'idk'
  }
}

export default multiplierToString
