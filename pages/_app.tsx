import '~/styles/globals.css';

import type { AppProps } from 'next/app';
import * as React from 'react';
import { QueryClient, QueryClientProvider, Hydrate } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { WalletProvider } from '~/components/Web3';
import { NextIntlProvider } from 'next-intl';
import { ThemeProvider } from 'next-themes';
import { Inter, Exo_2 } from '@next/font/google';

const inter = Inter({ subsets: ['latin'] });
const exo2 = Exo_2({ weight: ['300', '400', '500', '600', '700'], subsets: ['latin'] });

function App({ Component, pageProps }: AppProps) {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${inter.style.fontFamily}, sans-serif;
        }

        .font-exo {
          font-family: ${exo2.style.fontFamily}, sans-serif;
        }
      `}</style>

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
    </>
  );
}

export default App;
