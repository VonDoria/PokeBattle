import Head from "next/head";
import { useContext } from "react";
import UserPokemonCard from "../components/UserPokemonCard/UserPokemonCard";
import { DataContext } from "../context/DataContext"
import { UserPokemonContext } from "../context/UserPokemonContext";
import styles from '../styles/FavoriteList.module.scss'

export default function FavoriteList(){

    const { favoriteList } = useContext(UserPokemonContext);
    const { pokemonList } = useContext(DataContext);

    return (
        <div className={styles.container}>
            <Head>
                <title>Favorite</title>
                <link rel="shortcut icon" href="pokecatch.png" />
            </Head>
            {favoriteList().map((pokemonId, index) => {
                return <UserPokemonCard key={`pokemon_favorite_card_${index}`} pokemon={pokemonList[pokemonId - 1]} />
            })}
        </div>
    )
}