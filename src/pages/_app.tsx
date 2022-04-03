import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { Provider } from 'urql'
import { client, ssrCache } from '../lib/urql'
import { DataContextProvider } from '../context/DataContext';
import { UserPokemonContextProvider } from '../context/UserPokemonContext';
import { NotificationContextProvider } from '../context/NotificationContext';

function MyApp({ Component, pageProps }: AppProps) {
  if(pageProps.urqlState){
    ssrCache.restoreData(pageProps.urqlState);
  }
  return (
    <Provider value={client}>
      <NotificationContextProvider>
        <DataContextProvider>
          <UserPokemonContextProvider>
            <Component {...pageProps} />
          </UserPokemonContextProvider>
        </DataContextProvider>
      </NotificationContextProvider>
    </Provider>
  )
}

export default MyApp
