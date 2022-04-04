import { useContext, useEffect, useState } from "react";
import UserPokemonCard from "../components/UserPokemonCard/UserPokemonCard";
import UserPokemonForm from "../components/UserPokemonForm/UserPokemonForm";
import { DataContext } from "../context/DataContext";
import { UserPokemonContext } from "../context/UserPokemonContext";
import { Pokemon } from "../types/PokemonTypes";

import styles  from '../styles/TeamSelect.module.scss';
import TeamForm from "../components/TeamForm/TeamForm";
import PokemonInfos from "../components/PokemonInfos/PokemonInfos";
import Head from "next/head";

export default function TeamSelect(){

    const { focus } = useContext(UserPokemonContext);
    const { pokemonList } = useContext(DataContext);
    
    return(
        <div className={styles.container}>
            <Head>
                <title>Pokedex</title>
                <link rel="shortcut icon" href="pokecatch.png" />
            </Head>
            <span>
                <TeamForm />
            </span>
            <div className={styles.team}>
                {pokemonList[focus - 1] && <PokemonInfos pokemon={pokemonList[focus -1]} />}
            </div>
            <UserPokemonForm />
        </div>
    )
}