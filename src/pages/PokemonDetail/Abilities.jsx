import { React, useEffect, useState, useCallback } from 'react'
import axios from 'axios'

const Abilities = ( { data } ) => {
  // data is an array of ability-related objects.

  const [abilityDetails, setAbilityDetails] = useState([])
  const abilityNames = data.map(ability => {
    return ability.ability.name
  })
  const abilityLinks = data.map(ability => {
    return ability.ability.url
  })
  
  const fetchDescriptions = useCallback(async () => {
    const responses = await Promise.all(abilityLinks.map(url => {
      return axios.get(url)
    }))
    const newData = responses.map(response => response.data)
    setAbilityDetails(() => {
      return newData.map(entry => {
        const englishData = entry.effect_entries.find(effectEntry => effectEntry.language.name === 'en');
        return {
          name: entry.name,
          description: englishData.effect
        };
      });
    });
  }, [abilityLinks])

  useEffect(() => {
    fetchDescriptions()
  }, [fetchDescriptions])

  if (!abilityDetails)
    return

  const abilityFinalResult = abilityDetails.map(ability => {
    return (
      <div>
        {ability.name} = {ability.description}
      </div>
    )
  })

  return (
    <div> {abilityFinalResult} </div>)
}

export default Abilities;