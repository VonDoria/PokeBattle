import { useContext, useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { DataContext } from "../../context/DataContext";
import { UserPokemonContext } from "../../context/UserPokemonContext";
import { Pokemon } from "../../types/PokemonTypes";
import styles from './UserPokemonForm.module.scss';

export default function UserPokemonForm(){

    const { setFocus, isFavorite, focus } = useContext(UserPokemonContext);
    const { pokemonList } = useContext(DataContext);
    const [ search, setSearch ] = useState('');
    const [ favoriteFilter, setFavoriteFilter ] = useState(false);
    const [ typeFilter, setTypeFilter ] = useState<string[]>([]);
    const [ regionFilter, setRegionFilter ] = useState<string[]>([]);

    function toggleTypeFilter(type: string){
        if(typeFilter.includes(type)){
            setTypeFilter([...typeFilter.filter(t => t !== type)]);    
        }else{
            setTypeFilter([...typeFilter, type]);    
        }
    }

    function toggleRegionFilter(region: string){
        if(regionFilter.includes(region)){
            setRegionFilter([...regionFilter.filter(t => t !== region)]);    
        }else{
            setRegionFilter([...regionFilter, region]);    
        }
    }

    function applyFilters(pokemon: Pokemon){
        let name = false;
        let type = false;
        let region = false;
        if(search !== ''){
            name = pokemon.name.includes(search);
        }else{
            name = true;
        }
        if(typeFilter.length > 0){
            type = pokemon.type.filter(t => t.name && typeFilter.includes(t.name)).length > 0;
        }else{
            type = true;
        }
        if(regionFilter.length > 0){

            if(regionFilter.includes('Kanto')){
                region = pokemon.id <= 151
            }
            if(!region && regionFilter.includes('Johto')){
                region = pokemon.id > 151 && pokemon.id <= 251
            }
            if(!region && regionFilter.includes('Hoenn')){
                region = pokemon.id > 251 && pokemon.id <= 386
            }
            if(!region && regionFilter.includes('Sinnoh')){
                region = pokemon.id > 386 && pokemon.id <= 478
            }
        }else{
            region = true;
        }
        if(favoriteFilter){
            return name && type && region && isFavorite(pokemon.id);
        }else{
            return name && type && region;
        }
    }

    return (
        <div className={styles.container}>
            <span className={styles.filterType}>
                <b onClick={() => toggleTypeFilter('grass')} className={typeFilter.includes('grass') ? styles.grass : styles.grassButton}>Grass</b>
                <b onClick={() => toggleTypeFilter('fire')} className={typeFilter.includes('fire') ? styles.fire : styles.fireButton}>Fire</b>
                <b onClick={() => toggleTypeFilter('water')} className={typeFilter.includes('water') ? styles.water : styles.waterButton}>Water</b>
                <b onClick={() => toggleTypeFilter('electric')} className={typeFilter.includes('electric') ? styles.electric : styles.electricButton}>Electric</b>
                <b onClick={() => toggleTypeFilter('flying')} className={typeFilter.includes('flying') ? styles.flying : styles.flyingButton}>Flying</b>
                <b onClick={() => toggleTypeFilter('normal')} className={typeFilter.includes('normal') ? styles.normal : styles.normalButton}>Normal</b>
                <b onClick={() => toggleTypeFilter('poison')} className={typeFilter.includes('poison') ? styles.poison : styles.poisonButton}>Poison</b>
                <b onClick={() => toggleTypeFilter('bug')} className={typeFilter.includes('bug') ? styles.bug : styles.bugButton}>Bug</b>
                <b onClick={() => toggleTypeFilter('fighting')} className={typeFilter.includes('fighting') ? styles.fighting : styles.fightingButton}>Fighting</b>
                <b onClick={() => toggleTypeFilter('rock')} className={typeFilter.includes('rock') ? styles.rock : styles.rockButton}>Rock</b>
                <b onClick={() => toggleTypeFilter('ground')} className={typeFilter.includes('ground') ? styles.ground : styles.groundButton}>Ground</b>
                <b onClick={() => toggleTypeFilter('steel')} className={typeFilter.includes('steel') ? styles.steel : styles.steelButton}>Steel</b>
                <b onClick={() => toggleTypeFilter('ice')} className={typeFilter.includes('ice') ? styles.ice : styles.iceButton}>Ice</b>
                <b onClick={() => toggleTypeFilter('psychic')} className={typeFilter.includes('psychic') ? styles.psychic : styles.psychicButton}>Psychic</b>
                <b onClick={() => toggleTypeFilter('ghost')} className={typeFilter.includes('ghost') ? styles.ghost : styles.ghostButton}>Ghost</b>
                <b onClick={() => toggleTypeFilter('dark')} className={typeFilter.includes('dark') ? styles.dark : styles.darkButton}>Dark</b>
                <b onClick={() => toggleTypeFilter('dragon')} className={typeFilter.includes('dragon') ? styles.dragon : styles.dragonButton}>Dragon</b>
                <b onClick={() => toggleTypeFilter('fairy')} className={typeFilter.includes('fairy') ? styles.fairy : styles.fairyButton}>Fairy</b>
            </span>
            <span className={styles.filterGeneration}>
                <b onClick={() => toggleRegionFilter('Kanto')} className={`${regionFilter.includes('Kanto') && styles.selected}`}>Kanto</b>
                <b onClick={() => toggleRegionFilter('Johto')} className={`${regionFilter.includes('Johto') && styles.selected}`}>Johto</b>
                <b onClick={() => toggleRegionFilter('Hoenn')} className={`${regionFilter.includes('Hoenn') && styles.selected}`}>Hoenn</b>
                <b onClick={() => toggleRegionFilter('Sinnoh')} className={`${regionFilter.includes('Sinnoh') && styles.selected}`}>Sinnoh</b>
            </span>
            <span className={styles.search}>
                <input value={search} onChange={event => setSearch(event.target.value)}/>
                <div onClick={() => setFavoriteFilter(!favoriteFilter)}>
                    {favoriteFilter ? <AiFillStar /> : <AiOutlineStar />}
                </div>
            </span>
            <ul>
                {pokemonList.filter((pokemon) => applyFilters(pokemon)).map((pokemon, index) => {
                    return (
                        <li key={`pokemon_${index}`} onClick={() => setFocus(pokemon.id)}>
                            <h4>#{('00' + pokemon.id).slice(-3)}</h4>
                            <h3>{pokemon.name}</h3>
                            <span>
                                {pokemon.type.map((t, i) => <b className={t.name && styles[t.name]} key={`type_${i}`}>{t.name}</b>)}
                            </span>
                            <img alt={pokemon.name} src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`} />
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}