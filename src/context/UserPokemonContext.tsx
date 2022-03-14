import { createContext, ReactNode, useEffect, useState } from "react"
import { UserPokemon } from "../types/UserPokemonTypes";

type UserPokemonContextType = {
    team?: UserPokemon[];
    setTeam: (team: UserPokemon[]) => void;
    focus: number;
    setFocus: (id: number) => void;
    trigger: boolean;
    setTrigger: (trigger: boolean) => void;
    teamNumber: number;
    isFavorite: (pokemonId: number) => boolean;
    favorite: (pokemonId: number) => void;
    favoriteList: () => number[];
}

type UserPokemonContextProviderProps = {
    children: ReactNode;
}

export const UserPokemonContext = createContext({} as UserPokemonContextType)

export function UserPokemonContextProvider(props: UserPokemonContextProviderProps){

    const teamNumber = 6;

    const [team, setTeam] = useState<UserPokemon[]>([]);
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

    useEffect(() => {
        if (typeof window !== 'undefined'){
            let favoriteIdString = localStorage.getItem('favorite');
            if(!favoriteIdString){
                localStorage.setItem('favorite', '');
                favoriteIdString = '[]';
                localStorage.setItem('favorite', favoriteIdString);
            }
        }
    }, [])

    return (
        <UserPokemonContext.Provider value={{
            team,
            setTeam,
            focus,
            setFocus,
            trigger,
            setTrigger,
            teamNumber,
            favorite,
            isFavorite,
            favoriteList
        }}>
            {props.children}
        </UserPokemonContext.Provider>
    )
}