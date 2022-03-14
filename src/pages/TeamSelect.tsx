import { useContext, useEffect, useState } from "react";
import UserPokemonCard from "../components/UserPokemonCard/UserPokemonCard";
import UserPokemonForm from "../components/UserPokemonForm/UserPokemonForm";
import { DataContext } from "../context/DataContext";
import { UserPokemonContext } from "../context/UserPokemonContext";
import { Pokemon } from "../types/PokemonTypes";

import styles  from '../styles/TeamSelect.module.scss';

export default function TeamSelect(){

    const { team, trigger, teamNumber } = useContext(UserPokemonContext);
    const { pokemonList } = useContext(DataContext);
    const [ pokemonCards, setPokemonCards ] = useState<Pokemon[]>([])

    useEffect(() => {
        setPokemonCards(team?.map(p => pokemonList[p.id - 1]) || [])
    }, [trigger])
    
    return(
        <div className={styles.container}>
            <div className={styles.team}>
                {Array(teamNumber).fill('').map((x,i)=> {
                    if(pokemonCards[i]){
                        return <UserPokemonCard key={`pokemon_card_${i}`} cardId={i} pokemon={pokemonCards[i]} />
                    }
                })}
            </div>
            <UserPokemonForm />
        </div>
    )
}