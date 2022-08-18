import '@fontsource/exo-2/500.css';
import '@fontsource/exo-2/600.css';
import '@fontsource/exo-2/700.css';
import 'styles/globals.css';

import type { AppProps } from 'next/app';
import * as React from 'react';
import { QueryClient, QueryClientProvider, Hydrate } from '@tanstack/react-query';
import { WalletProvider } from 'components/Web3';
import { NextIntlProvider } from 'next-intl';
import { ThemeProvider } from 'next-themes';

function App({ Component, pageProps }: AppProps) {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <ThemeProvider defaultTheme="system" attribute="class">
      <NextIntlProvider messages={pageProps.messages}>
        <WalletProvider>
          <QueryClientProvider client={queryClient}>
            <Hydrate state={pageProps.dehydratedState}>
              <Component {...pageProps} />
            </Hydrate>
          </QueryClientProvider>
        </WalletProvider>
      </NextIntlProvider>
    </ThemeProvider>
  );
}

export default App;
