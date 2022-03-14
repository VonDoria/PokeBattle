import { GetServerSideProps } from 'next'
import Link from 'next/link';
import { useContext, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import { useGetAllPokemonsQuery, GetAllPokemonsDocument, useGetTypesRelationsQuery, GetTypesRelationsDocument } from '../generated/graphql'
import { client, ssrCache } from '../lib/urql'
import { Pokemon, TypeRelations } from '../types/PokemonTypes';


export default function Home(){  
  const { setPokemonList, setTypeRelations, pokemonList } = useContext(DataContext);

  const [ allPokemonsList ] = useGetAllPokemonsQuery();
  const [ typeRelationList ] = useGetTypesRelationsQuery();

  useEffect(() => {
    if(allPokemonsList?.data !== undefined){
      const pokemonList : Pokemon[] = allPokemonsList?.data?.pokemon_v2_pokemon.map(pokemon => {
        return {
          id: pokemon.id,
          name: pokemon.name,
          stage: pokemon.order,
          type: pokemon.pokemon_v2_pokemontypes.map(type => { 
            return {
              id: type.pokemon_v2_type?.id,
              name: type.pokemon_v2_type?.name
            }
          }),
          status: pokemon.pokemon_v2_pokemonstats.map(stat => {
            return {
              name: stat.pokemon_v2_stat?.name,
              baseStatus: stat.base_stat
            }
          }),
          evolutions: pokemon.pokemon_v2_pokemonspecy?.pokemon_v2_evolutionchain?.pokemon_v2_pokemonspecies.map(evolution => {
            return {
              id: evolution.id,
              name: evolution.name,
              stage: evolution.order
            }
          }),
          abilities: pokemon.pokemon_v2_pokemonabilities.map(abilitie => {
            return {
              id: abilitie.pokemon_v2_ability?.id,
              name: abilitie.pokemon_v2_ability?.name
            }
          }),
          moves: pokemon.pokemon_v2_pokemonmoves.map(move => {
            return {
              id: move.pokemon_v2_move?.id,
              name: move.pokemon_v2_move?.name,
              accuracy: move.pokemon_v2_move?.accuracy,
              power: move.pokemon_v2_move?.power,
              pp: move.pokemon_v2_move?.pp,
              priority: move.pokemon_v2_move?.priority,
              type: {
                id: move.pokemon_v2_move?.pokemon_v2_type?.id,
                name: move.pokemon_v2_move?.pokemon_v2_type?.name
              }
            }
          })
        }
      });
      setPokemonList(pokemonList);
    }    
  }, [allPokemonsList])

  useEffect(() => {
    if(typeRelationList.data !== undefined){
      const typeRelations: TypeRelations[] = typeRelationList.data.pokemon_v2_type.map(type => {
        return {
          id: type.id,
          name: type.name,
          relations: type.pokemon_v2_typeefficacies.map(relation => {
            return {
              id: relation.pokemonV2TypeByTargetTypeId?.id,
              name: relation.pokemonV2TypeByTargetTypeId?.name,
              damageFactor: relation.damage_factor
            }
          })
        }
      });
      setTypeRelations(typeRelations);
    }
  }, [typeRelationList])

  return (
    <div>
      Home page
      {pokemonList && <Link href="/TeamSelect">TeamSelect</Link>}
    </div>
  )
}

// export const getServerSideProps: GetServerSideProps = async () => {
//   await client.query(GetAllPokemonsDocument).toPromise()
//   await client.query(GetTypesRelationsDocument).toPromise()

//   return {
//     props: {
//       urqState: ssrCache.extractData()
//     }
//   }
// }