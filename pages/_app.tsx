import 'styles/globals.css';
import type { AppProps } from 'next/app';
import * as React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ThemeProvider } from 'next-themes';
import { WalletProvider } from 'components/Web3';

function App({ Component, pageProps }: AppProps) {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <ThemeProvider attribute="class">
      <WalletProvider>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </WalletProvider>
    </ThemeProvider>
  );
}

export default App;
