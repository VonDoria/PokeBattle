
type Type = {
    id?: number;
    name?: string;    
}

type Abilities = {
    id?: number;
    name?: string;
}

export type Moves = {
    id?: number;
    name?: string;
    accuracy?: number | null | undefined;
    type?: Type;
    power?: number | null | undefined;
    pp?: number | null | undefined;
    priority?: number | null | undefined;

}

export type Evolutions = {
    id: number;
    name: string;
    stage: number | null | undefined;
}

type Status = {
    baseStatus: number;
    name?: string;
}

export type Pokemon = {
    id: number;
    name: string;
    type: Type[];
    status: Status[];
    abilities: Abilities[] | null | undefined;
}

type TypeRelation = {
    id: number | null | undefined;
    name: string | null | undefined;
    damageFactor: number;
}

export type TypeRelations = {
    id: number;
    name: string;
    relations: TypeRelation[] | null | undefined;
}
