import { useContext, useState } from "react";
import { DataContext } from "../../context/DataContext";
import { UserPokemonContext } from "../../context/UserPokemonContext";
import { FaArrowLeft } from "react-icons/fa";
import styles from './UserPokemonForm.module.scss';
import Link from "next/link";

export default function UserPokemonForm(){

    const { team, setTeam, focus, setFocus, trigger, setTrigger, teamNumber } = useContext(UserPokemonContext);
    const { pokemonList } = useContext(DataContext);
    const [ search, setSearch ] = useState('')

    function selectPokemon(id: number){
        const addPokemon = {
            id: id,
            moves: []
        }
        if(team && team.length === teamNumber){
            let tempTeam = team;
            tempTeam[focus] = addPokemon;
            setTeam(tempTeam);
        }else if(team){
            setTeam([...team, addPokemon]);
        }
        if(focus !== (teamNumber - 1)){
            setFocus(focus + 1);
        }
        setTrigger(!trigger);
        setSearch('');
    }

    return (
        <div className={styles.container}>
            <span>
                <p className={styles.back}>
                    <Link href="/"><FaArrowLeft /></Link>
                </p>
                <p className={`${styles.next} ${team?.length !== teamNumber && styles.hide}`}>
                    <Link href="/">Go to battle!</Link>
                </p>
            </span>
            <input value={search} onChange={event => setSearch(event.target.value)}/>
            <ul>
                {pokemonList.filter((pokemon) => pokemon.name.includes(search) || search === '').map((pokemon, index) => {
                    return (
                        <li key={`pokemon_${index}`} onClick={() => selectPokemon(pokemon.id)}>
                            <h4>#{('00' + pokemon.id).slice(-3)}</h4>
                            <h3>{pokemon.name}</h3>
                            <span>
                                {pokemon.type.map((t, i) => <b className={t.name && styles[t.name]} key={`type_${i}`}>{t.name}</b>)}
                            </span>
                            <img alt={pokemon.name} src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`} />
                        </li>
                    )
                })}
            </ul>
            {/* {focus && (
                <div className={styles.moveList}>
                    {pokemonList[focus].moves?.map((move, index) => {
                        return (
                            <span>

                            </span>
                        )
                    })}
                </div>
            )} */}
        </div>
    )
}