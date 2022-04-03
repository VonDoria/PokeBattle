
export type TeamType =  {
    name: string;
    pokemons: TeamPokemonType[];
}

export type TeamPokemonType = {
    id?: number;
    moves: (number | null)[];
    status?: any;
}