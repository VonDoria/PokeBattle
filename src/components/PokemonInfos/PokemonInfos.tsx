import { useContext, useEffect, useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { BiRun } from "react-icons/bi";
import { BsHeart, BsShield } from "react-icons/bs";
import { GiBroadsword, GiRosaShield } from "react-icons/gi";
import { RiSwordLine } from "react-icons/ri";
import { UserPokemonContext } from "../../context/UserPokemonContext";
import { useGetPokemonMovesQuery } from "../../generated/graphql";
import { Moves, Pokemon } from "../../types/PokemonTypes";
import styles from './PokemonInfos.module.scss';

type PokemonInfosComponentType = {
    pokemon: Pokemon;
}

export default function PokemonInfos({ pokemon }: PokemonInfosComponentType){
    
    const { favorite, isFavorite, setTempPokemonTeam, tempPokemonTeam, setTrigger, trigger } = useContext(UserPokemonContext);
    const [ pokemonMovesQueryResult ] = useGetPokemonMovesQuery({ variables: { pokemonId: pokemon.id }});
    const [moveFilter, setMoveFilter] = useState('');
    const [pokemonMoveOrder, setPokemonMoveOrder] = useState(0);
    const [pokemonMoves, setPokemonMoves] = useState<Moves[]>([]);

    useEffect(() => {
        const moves = pokemonMovesQueryResult.data?.pokemon_v2_move.map(move => {
            return {
                id: move.id,
                name: move.name,
                accuracy: move.accuracy,
                type: {
                    id: move.pokemon_v2_type?.id,
                    name: move.pokemon_v2_type?.name
                },
                power: move.power,
                pp: move.pp,
                priority: move.priority
            }
        });
        if(moves){
            setPokemonMoves(moves);
        }
    }, [pokemonMovesQueryResult])

    function addMove(moveId: number){
        let pokemonMove = tempPokemonTeam;
        if(!pokemonMove.id){
            pokemonMove.id = pokemon.id;
            pokemonMove.status = pokemon.status;
        }
        if(!pokemonMove.moves.find(m => m === moveId)){
            pokemonMove.moves[pokemonMoveOrder] = moveId;
        }
        if(pokemonMoveOrder === 3){
            setPokemonMoveOrder(0)
        }else{
            setPokemonMoveOrder(pokemonMoveOrder + 1)
        }
        setTempPokemonTeam(pokemonMove);
        setMoveFilter('');
        setTrigger(!trigger);
    }

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

    return (
        <div className={styles.container}>
            <div onClick={() => favorite(pokemon.id)} className={styles.favorite}>
                {isFavorite(pokemon.id) ? <AiFillStar /> : <AiOutlineStar />}
            </div>
            <div className={styles.name}>
                <img alt={pokemon.name} src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}/>
                <p>{pokemon.name}</p>
                <span>
                    {pokemon.type.map((t, i) => <p key={`card_type_${pokemon.id}_${i}`} className={t.name && styles[t.name]}>{t.name}</p>)}
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
            <div className={styles.movesSelect}>
                <p>Moves</p>
                <div className={styles.moves}>
                    {tempPokemonTeam.moves.map((moveId, index) => {
                        const move = pokemonMoves.find(m => m.id == moveId);
                        const isInFocus = pokemonMoveOrder == index && move !== undefined
                        return (
                            <span onClick={() => setPokemonMoveOrder(index)} 
                            key={`Pokemon_selected_Move_${index}`}
                            className={`${move?.type?.name && styles[move.type.name]} ${isInFocus && styles.active}`}>
                                {move?.name}
                            </span>
                        )
                    })}
                </div>
                <input value={moveFilter} onChange={event => setMoveFilter(event.target.value)}/>
                <span>
                    {pokemonMoves.filter(m => m.name?.includes(moveFilter) || moveFilter === '').map((move, index) => {
                        return (
                            <div onClick={() => move.id && addMove(move.id)} key={`pokemon_move_${index}`} className={move.type?.name && styles[move.type.name]}>
                                <b>{move.name}</b>
                                <span>
                                    <p>power: {move.power}</p>
                                    <p>type: {move.type?.name}</p>
                                    <p>pp: {move.pp}</p>
                                    <p>accuracy: {move.accuracy}</p>
                                    <p>priority: {move.priority}</p>
                                </span>
                            </div>
                        )
                    })}
                </span>
            </div>
        </div>
    )
}