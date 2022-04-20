import Head from 'next/head';
import * as React from 'react';
import Header from './Header';
import classNames from 'classnames';
import Footer from './Footer';
import CustomToast from 'components/CustomToast';
import Hero from 'components/Hero';
import { useRouter } from 'next/router';
import { useDialogState } from 'ariakit';
import { OnboardDialog } from 'components/Dialog';
import { useAccount } from 'wagmi';

interface ILayoutProps {
  children: React.ReactNode;
  className?: string;
  noBanner?: boolean;
}

export default function Layout({ children, className, noBanner = false, ...props }: ILayoutProps) {
  const router = useRouter();
  const dialog = useDialogState();

  const [{ data: accountData, loading }] = useAccount();

  const firstRender = React.useRef(1);

  React.useEffect(() => {
    if (!loading && !accountData && !dialog.visible && firstRender.current === 1) {
      dialog.toggle();
      firstRender.current++;
    }
  }, [accountData, loading, dialog]);

  return (
    <>
      <Head>
        <title>LlamaPay</title>
        <meta
          name="description"
          content="LlamaPay is a multi-chain protocol that allows you to automate transactions and stream them by the second. The recipients can withdraw these funds at any time. This eliminates the need for manual transactions."
        />
      </Head>
      <Header />
      {router.pathname === '/' && (
        <>
          <Hero noBanner={noBanner} /> <OnboardDialog dialog={dialog} />
        </>
      )}

      <main className={classNames('flex-1 px-2 pb-8 md:px-[30px] lg:px-[60px] xl:px-[120px]', className)} {...props}>
        {children}
      </main>
      <Footer />
      <CustomToast />
    </>
  );
}
