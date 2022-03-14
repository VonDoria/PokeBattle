import { cacheExchange, createClient, dedupExchange, fetchExchange, ssrExchange } from 'urql';

const isServeSide = typeof window === 'undefined';
const ssrCache = ssrExchange({ isClient: !isServeSide });

const client = createClient({
    url: 'https://beta.pokeapi.co/graphql/v1beta',
    exchanges: [dedupExchange, cacheExchange, ssrCache, fetchExchange],
})

export { client, ssrCache };