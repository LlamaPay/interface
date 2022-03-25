import 'styles/globals.css';
import type { AppProps } from 'next/app';
import { Provider as GraphProvider } from 'urql';
import graphClient from 'services/graphql/client';
import { ThemeProvider } from 'next-themes';
import { WalletProvider } from 'components/Web3';

function App({ Component, pageProps }: AppProps) {
  return (
    <WalletProvider>
      <GraphProvider value={graphClient}>
        <ThemeProvider attribute="class">
          <Component {...pageProps} />
        </ThemeProvider>
      </GraphProvider>
    </WalletProvider>
  );
}

export default App;
