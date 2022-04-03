import { createContext, ReactNode, useState } from "react";
import { useGetPokemonEvolutionsQuery, useGetPokemonMovesQuery } from "../generated/graphql";
import { Pokemon, TypeRelations } from "../types/PokemonTypes";


type DataContextType = {
    pokemonList: Pokemon[];
    setPokemonList: (pokemonList: Pokemon[]) => void;
    typeRelations: TypeRelations[];
    setTypeRelations: (typeRelationList: TypeRelations[]) => void;
    getPokemonGif: (pokemonId: number) => string;
}

type DataContextProviderProps = {
    children: ReactNode;
}

export const DataContext = createContext({} as DataContextType)

export function DataContextProvider(props: DataContextProviderProps){
    const [ pokemonList, setPokemonList ] = useState<Pokemon[]>([]);
    const [ typeRelations, setTypeRelations ] = useState<TypeRelations[]>([]);

    function getPokemonGif(pokemonId: number){
        return `https://cdn.statically.io/gh/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${pokemonId}.gif`
    }

    return(
        <DataContext.Provider value={{
            pokemonList,
            setPokemonList,
            typeRelations,
            setTypeRelations,
            getPokemonGif
        }}>
            {props.children}
        </DataContext.Provider>
    )
}