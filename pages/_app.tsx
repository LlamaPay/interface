import '@fontsource/exo-2/300.css';
import '@fontsource/exo-2/400.css';
import '@fontsource/exo-2/500.css';
import '@fontsource/exo-2/600.css';
import '@fontsource/exo-2/700.css';
import '~/styles/globals.css';

import type { AppProps } from 'next/app';
import * as React from 'react';
import { QueryClient, QueryClientProvider, Hydrate } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { WalletProvider } from '~/components/Web3';
import { NextIntlProvider } from 'next-intl';
import { ThemeProvider } from 'next-themes';

function App({ Component, pageProps }: AppProps) {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <ThemeProvider defaultTheme="light" attribute="class">
      <NextIntlProvider messages={pageProps.messages}>
        <WalletProvider>
          <QueryClientProvider client={queryClient}>
            <Hydrate state={pageProps.dehydratedState}>
              <Component {...pageProps} />
              <ReactQueryDevtools initialIsOpen={false} />
            </Hydrate>
          </QueryClientProvider>
        </WalletProvider>
      </NextIntlProvider>
    </ThemeProvider>
  );
}

export default App;
