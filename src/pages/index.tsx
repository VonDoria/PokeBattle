import { GetServerSideProps } from 'next'
import Link from 'next/link';
import { useContext, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import { useGetPokemonListQuery, GetPokemonListDocument, useGetTypesRelationsQuery, GetTypesRelationsDocument, useGetPokemonEvolutionsQuery, useGetPokemonMovesQuery } from '../generated/graphql'
import { client, ssrCache } from '../lib/urql'
import { Pokemon, TypeRelations } from '../types/PokemonTypes';
import styles from '../styles/Home.module.scss';
import Head from 'next/head';


export default function Home(){  
  const { setPokemonList, setTypeRelations, pokemonList } = useContext(DataContext);

  const [ allPokemonsList ] = useGetPokemonListQuery();
  const [ typeRelationList ] = useGetTypesRelationsQuery();


  useEffect(() => {
    if(allPokemonsList?.data !== undefined){
      const pokemonList : Pokemon[] = allPokemonsList?.data?.pokemon_v2_pokemon.map(pokemon => {
        return {
          id: pokemon.id,
          name: pokemon.name,
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
          abilities: pokemon.pokemon_v2_pokemonabilities.map(abilitie => {
            return {
              id: abilitie.pokemon_v2_ability?.id,
              name: abilitie.pokemon_v2_ability?.name
            }
          }),
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
    <div className={styles.container}>
      <Head>
        <title>Home</title>
        <link rel="shortcut icon" href="pokecatch.png" />
      </Head>
      Home page
      {pokemonList.length > 0 ? (
        <span>
          <Link href="/TeamSelect">TeamSelect</Link>
          <Link href="/FavoriteList">Favorite</Link>
        </span>
      ) : <img alt='loading' src='pokeloading.png' />}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  await client.query(GetPokemonListDocument).toPromise()
  await client.query(GetTypesRelationsDocument).toPromise()

  return {
    props: {
      urqState: ssrCache.extractData()
    }
  }
}