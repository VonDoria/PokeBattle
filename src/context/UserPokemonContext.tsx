import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { TeamPokemonType, TeamType } from "../types/PokemonTeam";
import { UserPokemon } from "../types/UserPokemonTypes";
import { DataContext } from "./DataContext";
import { NotificationContext } from "./NotificationContext";

type UserPokemonContextType = {
    clearTeam: TeamType;
    tempTeam: TeamType;
    setTempTeam: (team: TeamType) => void;
    tempPokemonTeam: TeamPokemonType;
    setTempPokemonTeam: (pokemon: TeamPokemonType) => void;
    focus: number;
    setFocus: (id: number) => void;
    trigger: boolean;
    setTrigger: (trigger: boolean) => void;
    teamNumber: number;
    isFavorite: (pokemonId: number) => boolean;
    favorite: (pokemonId: number) => void;
    favoriteList: () => number[];
    getTeams: () => TeamType[];
    removeTeam: (name: string) => void;
    addPokemonToTeam: (name: string, pokemon: TeamPokemonType, position: number) => void;
    removePokemonFromTeam: (name: string, pokemonId: number) => void;
}

type UserPokemonContextProviderProps = {
    children: ReactNode;
}

export const UserPokemonContext = createContext({} as UserPokemonContextType)

export function UserPokemonContextProvider(props: UserPokemonContextProviderProps){

    const { toastSuccess } = useContext(NotificationContext);
    const { pokemonList } = useContext(DataContext);

    const teamNumber = 1;
    const clearTeam = {
        name: '',
        pokemons: [
            {
                id: undefined,
                moves: [null, null, null, null],
                status: []
            },
            {
                id: undefined,
                moves: [null, null, null, null],
                status: []
            },
            {
                id: undefined,
                moves: [null, null, null, null],
                status: []
            },
            {
                id: undefined,
                moves: [null, null, null, null],
                status: []
            },
            {
                id: undefined,
                moves: [null, null, null, null],
                status: []
            },
            {
                id: undefined,
                moves: [null, null, null, null],
                status: []
            },
        ]
    };
    const cleanPokemon = {
        id: undefined,
        moves: [null, null, null, null],
        status: []
    }

    const [tempTeam, setTempTeam] = useState<TeamType>(clearTeam);
    const [tempPokemonTeam, setTempPokemonTeam] = useState<TeamPokemonType>(cleanPokemon);
    const [focus, setFocus] = useState<number>(0);
    const [trigger, setTrigger] = useState<boolean>(false);

    function favorite(pokemonId: number){
        if (typeof window !== 'undefined'){
            let favoriteIdString = localStorage.getItem('favorite');
            if(favoriteIdString){
                let favoriteIdList: number[] = JSON.parse(favoriteIdString);
            if(favoriteIdList.find(id => id === pokemonId)){
                favoriteIdList = favoriteIdList.filter(id => id !== pokemonId);
            }else{
                favoriteIdList.push(pokemonId);
            }
                localStorage.setItem('favorite', JSON.stringify(favoriteIdList));
            }
            setTrigger(!trigger);
        }
    }

    function isFavorite(pokemonId?: number){
        if (typeof window !== 'undefined'){
            let favoriteIdString = localStorage.getItem('favorite');
            if(favoriteIdString){
                let favoriteIdList: number[] = JSON.parse(favoriteIdString);
                return !!favoriteIdList.find(id => id === pokemonId);
            }
        }
        return false;
    }

    function favoriteList(){
        if (typeof window !== 'undefined'){
            let favoriteIdString = localStorage.getItem('favorite');
            if(favoriteIdString){
                let favoriteIdList: number[] = JSON.parse(favoriteIdString);
                return favoriteIdList;
            }
        }
        return [];
    }

    function getTeams(){
        if (typeof window !== 'undefined'){
            let userTeamsString = localStorage.getItem('User-Teams');
            if(userTeamsString){
                let userTeamsList: TeamType[] = JSON.parse(userTeamsString);
                return userTeamsList;
            }
        }
        return [];
    }

    function removeTeam(name: string){
        if (typeof window !== 'undefined'){
            let userTeamsString = localStorage.getItem('User-Teams');
            if(userTeamsString){
                let userTeamsList: TeamType[] = JSON.parse(userTeamsString);
                localStorage.setItem('User-Teams', JSON.stringify(userTeamsList.filter(t => t.name !== name)));
                toastSuccess(`${name} was deleted.`);
            }
        }
    }

    function addPokemonToTeam(name: string, pokemon: TeamPokemonType, position: number){
        if (typeof window !== 'undefined'){
            let userTeamsString = localStorage.getItem('User-Teams');
            if(userTeamsString){
                let userTeamsList: TeamType[] = JSON.parse(userTeamsString);
                if(!userTeamsList.find(t => t.name === tempTeam.name)){
                    userTeamsList.push(tempTeam);
                }
                userTeamsList = userTeamsList.map(t => {
                    if(t.name === name){
                        let editPokemon = t.pokemons.map(p => p.id).indexOf(pokemon.id);
                        if(editPokemon >= 0){
                            t.pokemons[editPokemon] = pokemon;
                            toastSuccess(`${pokemon.id && pokemonList[pokemon.id - 1].name}' was updated in ${name}.`);
                        }else{
                            t.pokemons[position] = pokemon;
                            toastSuccess(`${pokemon.id && pokemonList[pokemon.id - 1].name}' was added to ${name}.`);
                        }
                    }
                    setTempTeam(t);
                    return t;
                });
                localStorage.setItem('User-Teams', JSON.stringify(userTeamsList));
            }
        }
    }

    function removePokemonFromTeam(name: string, pokemonId: number){
        if (typeof window !== 'undefined'){
            let userTeamsString = localStorage.getItem('User-Teams');
            if(userTeamsString){
                let userTeamsList: TeamType[] = JSON.parse(userTeamsString);
                userTeamsList = userTeamsList.map(t => {
                    if(t.name === name){
                        let pokemonOrder = t.pokemons.map(p => p.id).indexOf(pokemonId);
                        t.pokemons[pokemonOrder] = cleanPokemon;
                        let tempTeamChanged = tempTeam;
                        tempTeamChanged.pokemons[pokemonOrder] = cleanPokemon;
                        setTempTeam(tempTeamChanged);
                    }
                    setTempTeam(t);
                    return t;
                });
                localStorage.setItem('User-Teams', JSON.stringify(userTeamsList));
                setTempPokemonTeam(cleanPokemon);
                toastSuccess(`${pokemonList[pokemonId - 1].name} was successfully removed from ${name}.`);
            }
        }
    }

    useEffect(() => {
        const pokemonInFocus = tempTeam.pokemons.find(p => p.id === focus);
        if(!pokemonInFocus){
            setTempPokemonTeam(cleanPokemon);
        }else{
            setTempPokemonTeam(pokemonInFocus);
        }
    }, [focus])

    useEffect(() => {
        if (typeof window !== 'undefined'){
            let favoriteIdString = localStorage.getItem('favorite');
            if(!favoriteIdString){
                favoriteIdString = '[]';
                localStorage.setItem('favorite', favoriteIdString);
            }
            let userTeamsString = localStorage.getItem('User-Teams');
            if(!userTeamsString){
                userTeamsString = '[]';
                localStorage.setItem('User-Teams', userTeamsString);
            }
        }
    }, [])

    return (
        <UserPokemonContext.Provider value={{
            focus,
            setFocus,
            trigger,
            setTrigger,
            teamNumber,
            favorite,
            isFavorite,
            favoriteList,
            getTeams,
            removeTeam,
            addPokemonToTeam,
            removePokemonFromTeam,
            clearTeam,
            tempTeam,
            setTempTeam,
            tempPokemonTeam,
            setTempPokemonTeam
        }}>
            {props.children}
        </UserPokemonContext.Provider>
    )
}