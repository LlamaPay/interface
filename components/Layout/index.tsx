import Head from 'next/head';
import * as React from 'react';
import Header from './Header';
import classNames from 'classnames';
import Footer from './Footer';
import CustomToast from 'components/CustomToast';
import Hero from 'components/Hero';
import OnboardDialog from 'components/Onboard';
import { useRouter } from 'next/router';
import { useDialogState } from 'ariakit';

interface ILayoutProps {
  children: React.ReactNode;
  className?: string;
  noBanner?: boolean;
}

export default function Layout({ children, className, noBanner = false, ...props }: ILayoutProps) {
  const router = useRouter();

  const onboardDialog = useDialogState();

  return (
    <>
      <Head>
        <title>LlamaPay</title>
        <meta
          name="description"
          content="LlamaPay is a multi-chain protocol that allows you to automate transactions and stream them by the second. The recipients can withdraw these funds at any time. This eliminates the need for manual transactions."
        />
      </Head>
      <Header onboardDialog={onboardDialog} />
      {/* <div className="absolute top-0 bottom-0 right-0 left-0 overflow-hidden">
        <div
          style={{
            background: 'linear-gradient(195deg, #EFEFEF 13.39%, rgba(196, 196, 196, 0) 75.41%)',
            transform: 'rotate(20deg)',
          }}
          className="absolute left-[-60vw] top-[-80vh] -z-10 h-screen w-screen rounded-full"
        ></div>
        <div
          style={{
            background: 'linear-gradient(200.1deg, #D9F4E6 13.39%, rgba(255, 255, 255, 0) 75.41%)',
            transform: 'rotate(90deg)',
            top: 'calc(-50vh)',
          }}
          className="absolute left-[50vw] -z-10 h-[100vh] w-screen rounded-full"
        ></div>
      </div> */}
      {router.pathname === '/' && <Hero noBanner={noBanner} onboardDialog={onboardDialog} />}

      <main className={classNames('flex-1 px-2 pb-8 md:px-[30px] lg:px-[60px] xl:px-[120px]', className)} {...props}>
        {children}
      </main>
      <OnboardDialog dialog={onboardDialog} />
      <Footer />
      <CustomToast />
    </>
  );
}
