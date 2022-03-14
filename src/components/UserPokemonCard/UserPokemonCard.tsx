import { useContext } from 'react';
import { GiBroadsword, GiRosaShield } from "react-icons/gi";
import { BsHeart, BsShield } from "react-icons/bs";
import { BiRun } from "react-icons/bi";
import { RiSwordLine } from "react-icons/ri";
import { UserPokemonContext } from '../../context/UserPokemonContext';
import { Pokemon } from '../../types/PokemonTypes';
import styles from './UserPokemonCard.module.scss';
import { DataContext } from '../../context/DataContext';

type UserPokemonCardComponentType = {
    pokemon: Pokemon;
    cardId: number;
}

export default function UserPokemonCard({ pokemon, cardId }: UserPokemonCardComponentType){

    const { focus, setFocus } = useContext(UserPokemonContext);
    const { typeRelations } = useContext(DataContext);
    
    function statusIcon(status?: string){
        switch(status){
            case 'hp':
                return <BsHeart />
            case 'attack':
                return <GiBroadsword />
            case 'defense':
                return <BsShield />
            case 'special-attack':
                return <RiSwordLine />
            case 'special-defense':
                return <GiRosaShield />
            case 'speed':
                return <BiRun />
        }
    }

    function resistance(){
        const pokemonTypeId = pokemon.type.map(pt => pt.id);
        let resistance: string[] = [];
        let weakness: string[] = [];

        // ----------------------------- retorna os tipos ao qual o attack é pouco eficaz ---------------------------------------
        // let pokemonTypeRalation = typeRelations.filter(t => pokemonTypeId.includes(t.id));

        // pokemonTypeRalation.map(rl => {
        //     rl.relations?.map(t => (t.damageFactor < 100 && t.name) && resistance.push(t.name));
        // })
        // ----------------------------------------------------------------------------------------------------------------------

        typeRelations.map(t => {
            pokemonTypeId.map(pt => t.relations?.map(r => (r.id === pt && r.damageFactor < 100 && r.name) && resistance.push(t.name)))
            
        });

        typeRelations.map(t => {
            pokemonTypeId.map(pt => t.relations?.map(r => (r.id === pt && r.damageFactor > 100 && r.name) && weakness.push(t.name)))
            
        });

        return (
            <>
                {JSON.stringify(resistance.filter((v, i, a) => a.indexOf(v) === i))}
                {JSON.stringify(weakness.filter((v, i, a) => a.indexOf(v) === i))}
            </>
        );
    }

    function weakness(){
        
    }

    return (
        <span onClick={() => setFocus(cardId)} className={`${styles.container} ${cardId === focus && styles.focus}`}>
            <div className={styles.name}>
                <img alt={pokemon.name} src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}/>
                <p>{pokemon.name}</p>
                <span>
                    {pokemon.type.map((t, i) => <b key={`card_type_${pokemon.id}_${i}`} className={t.name && styles[t.name]}>{t.name}</b>)}
                </span>
            </div>
            <div className={styles.status}>
                <p>Status</p>
                {pokemon.status.map((status, i) => {
                    return (
                        <span key={`card_status_${pokemon.id}_${i}`}>
                            <div>
                                <p>
                                    {statusIcon(status.name)}
                                    &nbsp;
                                    {status.name}
                                </p>
                                <p>{status.baseStatus}</p>
                            </div>
                            <progress value={status.baseStatus} max="200"></progress>
                        </span>
                    )
                })}
            </div>
            {/* <div>
                <p>Weakness</p>
            </div>
            <div>
                <p>Resistance</p>
                {resistance()}
            </div> */}
            {/* <div className={styles.move}>
                <p>Moves</p>
                {team?.map((t, i) => pokemon.moves?.filter(m => t.moves?.find(tm => tm === m.id)).map(move => 
                {
                    return (
                        <b key={`card_move_${move.id}_${i}`}>
                            {move.name} - {move.power}
                        </b>
                    )
                }))}
            </div> */}
        </span>
    )
}