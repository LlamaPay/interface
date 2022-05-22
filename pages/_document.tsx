import { Html, Head, Main, NextScript } from 'next/document';
import classNames from 'classnames';
import { isDev } from 'utils/constants';

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
        <link rel="manifest" href="/favicons/site.webmanifest" />
      </Head>
      <body
        className={classNames(
          'bg-white text-black dark:bg-[#161818] dark:text-white',
          { 'debug-screens': isDev }
        )}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
