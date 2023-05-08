import { React, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Abilities from './Abilities';

const PokemonDetail = () => {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [abilityData, setAbilityData] = useState([]);

  const fetchData = async () => {

    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}/`);
    const responseData = await response.data;
    setPokemon(responseData);
  };

  const extractInformation = (data) => {
    const { abilities, id: idNumber, name } = data;
    setAbilityData(abilities);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    if (pokemon) {
      extractInformation(pokemon);
    }
  }, [pokemon]);

  if (!pokemon) {
    return (
      <div className='text-white bg-gradient-to-br from-slate-600 to-slate-900 min-h-screen'>
        Loading...
      </div>
    );
  }

  const { id: idNumber, name } = pokemon;
  const properName = name.charAt(0).toUpperCase() + name.slice(1);

  return (
    <div className='gap-x-2 gap-y-3 pt-4 text-white bg-gradient-to-br from-slate-600 to-slate-900 min-h-screen'>
      <div className="text-4xl font-bold flex justify-center">
        #{idNumber}: {properName}
      </div>
      <Abilities data={abilityData} />
    </div>
  );
};

export default PokemonDetail;
