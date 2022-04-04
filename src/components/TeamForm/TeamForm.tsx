import { useContext, useEffect, useState } from 'react';
import { DataContext } from '../../context/DataContext';
import { UserPokemonContext } from '../../context/UserPokemonContext';
import { TeamPokemonType, TeamType } from '../../types/PokemonTeam';
import { ImCross } from "react-icons/im";
import styles from './TeamForm.module.scss';
import { NotificationContext } from '../../context/NotificationContext';

export default function TeamForm(){
    const { getTeams, tempTeam, setTempTeam, tempPokemonTeam, setTempPokemonTeam, setFocus, removePokemonFromTeam, removeTeam, addPokemonToTeam, clearTeam } = useContext(UserPokemonContext);
    const { pokemonList } = useContext(DataContext);
    const { toastError } = useContext(NotificationContext);

    const [teamList, setTeamList] = useState<TeamType[]>([]);
    const [newTeamName, setNewTeamName] = useState<string>('');

    const [teamMemberFocus, setTeamMemberFocus] = useState<number>(0);

    function AddToTeam(){
        if(!newTeamName){
            toastError("You need to choose a team name before adding pokemons.");
            return;
        }
        addPokemonToTeam(newTeamName, tempPokemonTeam, teamMemberFocus)
        if(teamMemberFocus === 5){
            setTeamMemberFocus(0)
        }else{
            setTeamMemberFocus(teamMemberFocus + 1)
        }
        const teams = getTeams();
        setTeamList(teams);
    }
    
    function SelectTeamMemberFocus(teamOrder: number, pokemon: TeamPokemonType){
        pokemon.id && setFocus(pokemon.id);
        setTeamMemberFocus(teamOrder);
        setTempPokemonTeam({...pokemon});
    }

    function deleteTeam(teamName: string){
        removeTeam(teamName);
        setNewTeamName('');
        const teams = getTeams();
        setTeamList(teams);
    }
    
    useEffect(() => {
        const pokemonTeamOrder = tempTeam.pokemons.map(p => p.id).indexOf(tempPokemonTeam.id);
        if(pokemonTeamOrder >= 0){
            setTeamMemberFocus(pokemonTeamOrder);
        }else{
            const empytSlot = tempTeam.pokemons.map(p => p.id).indexOf(undefined);
            setTeamMemberFocus(empytSlot);
        }
    }, [tempPokemonTeam, tempTeam]);
    
    useEffect(() => {
        const savedTeam = teamList.find(t => t.name === newTeamName);
        if(savedTeam){
            setTempTeam(savedTeam);
        }else{
            let updateTeam = clearTeam;
            updateTeam.name = newTeamName;
            setTempTeam(updateTeam);
            setFocus(0);
        }
    }, [newTeamName]);

    useEffect(() => {
        const teams = getTeams();
        setTeamList(teams);
    }, []);

    return (
        <div className={styles.container}>
            <section className={styles.teamNames}>
                {teamList.map((team, index) => {
                    return (
                        <span key={`Team_Button_${index}`} onClick={() => setNewTeamName(team.name)}>
                            {team.name}
                            <button onClick={() => deleteTeam(team.name)}><ImCross /></button>
                        </span>
                    );
                })}
            </section>
            <section className={styles.pokemons}>
                <input placeholder='To add new team type a new name' onBlur={event => setNewTeamName(event.target.value)}/>
                <b>{newTeamName}</b>
                <hr />
                <div className={styles.teamCardsContainer}>
                    {tempTeam.pokemons.map((pokemon, index) => {
                        const alreadyInTeam = !!tempTeam.pokemons.find(p => p.id === tempPokemonTeam.id);
                        const addToTeam = !!tempPokemonTeam.moves[3] && teamMemberFocus === index && !alreadyInTeam;
                        const imgSource = addToTeam ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${tempPokemonTeam.id}.png` : "default-profile.png";
                        
                        if(!pokemon.id){
                            return (
                                <span key={`Pokemon_Team_Card_${index}`} className={`${addToTeam && styles.active}`} onClick={() => pokemon.id && SelectTeamMemberFocus(index, pokemon)}>
                                    <img alt={`${(addToTeam && tempPokemonTeam.id) ? pokemonList[tempPokemonTeam.id].name : "default-image"}`} src={imgSource} />
                                    {addToTeam && <button onClick={() => AddToTeam()} className={styles.add}>Add to team</button>}
                                    <button className={styles.remove} disabled={true}><ImCross /></button>
                                </span>
                            )
                        }else{
                            return (
                                <span key={`Pokemon_Team_Card_${index}`} className={`${teamMemberFocus === index && styles.active}`} onClick={() => pokemon.id && SelectTeamMemberFocus(index, pokemon)}>
                                    <img alt={pokemonList[pokemon.id].name} src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`} />
                                    <b>{pokemon.id && pokemonList[pokemon.id - 1].name}</b>
                                    <button className={styles.remove} onClick={() => pokemon.id && removePokemonFromTeam(tempTeam.name, pokemon.id)}><ImCross /></button>
                                </span>
                            )
                        }
                    })}
                </div>
            </section>
        </div>
    )
}