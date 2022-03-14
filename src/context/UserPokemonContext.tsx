import { createContext, ReactNode, useState } from "react"
import { UserPokemon } from "../types/UserPokemonTypes";

type UserPokemonContextType = {
    team?: UserPokemon[];
    setTeam: (team: UserPokemon[]) => void;
    focus: number;
    setFocus: (id: number) => void;
    trigger: boolean;
    setTrigger: (trigger: boolean) => void;
    teamNumber: number;
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

    return (
        <UserPokemonContext.Provider value={{
            team,
            setTeam,
            focus,
            setFocus,
            trigger,
            setTrigger,
            teamNumber
        }}>
            {props.children}
        </UserPokemonContext.Provider>
    )
}