import { React, useState, useEffect } from 'react'
import axios from 'axios'

function formatFields(data) {
  const wordList = data.split('-')
  // Capitalise the first letter of each word.
  const formattedWords = wordList.map(word => word.charAt(0).toUpperCase() + word.slice(1))
  // Now join them with spaces.
  return formattedWords.join(' ')
}

const Locations = ({ id }) => {
  const [locationData, setLocationData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}/encounters`);
        const data = await response.data;
        setLocationData(data);
      } catch (error) {
        setError(error);
      }
    };
    fetchLocationData();
  }, [id]);

  const extractInformation = (data) => {
    const information = data?.flatMap(encounter => {
      const { 
        location_area: { name: locationName }, 
        version_details: encounterList 
      } = encounter
      const encounterData = encounterList?.map(version => {
        const { 
          version: {name: versionName}, 
          encounter_details: encounterDetails 
        } = version
        const specificEncounterData = encounterDetails?.map((encounter) => {
          const level = Math.floor((encounter?.max_level + encounter?.min_level) / 2)
          return {
            level: level,
            encounterMethod: formatFields(encounter?.method.name),
          };
        });
        return {
          locationName: formatFields(locationName),
          versionName: formatFields(versionName),
          ...specificEncounterData[0],
        };
      });
      return encounterData;
    });
    return information;
  };

  const information = extractInformation(locationData);

  return <pre>{JSON.stringify(information, null, 2)}</pre>;

  if (error && !locationData) {
    return <div>Error: {error.message}</div>;
  }

  return (<pre> {JSON.stringify(locationData, null, 2)} </pre>)
}

export default Locations
