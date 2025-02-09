import type { AppProps } from 'next/app';
import { SupabaseProvider } from '../context/SupabaseContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SupabaseProvider>
      <Component {...pageProps} />
    </SupabaseProvider>
  );
}

export default MyApp; 