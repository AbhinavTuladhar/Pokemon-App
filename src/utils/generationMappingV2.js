// For getting the generation that pokemon was introduced on the basis of the id.

const generationMappingV2 = id => {
  const rangeMap = {
    '1-151': '1',
    '152-251': '2',
    '252-386': '3',
    '387-493': '4',
    '494-649': '5',
    '650-721': '6',
    '722-807': '7'
  }

  for (const range in rangeMap) {
    const [min, max] = range.split('-').map(Number);
    if (id >= min && id <= max) {
      return rangeMap[range];
    }
  }
  return 'default'
}

export default generationMappingV2