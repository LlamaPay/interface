import Head from 'next/head';
import * as React from 'react';

const Banner = () => {
  const hideBanner = () => {
    localStorage.setItem('banner-hidden', '1');
    document.documentElement.classList.add('banner-hidden');
  };

  return (
    <>
      <Head>
        <script>
          {`;(function(){
            try{
              if(+(localStorage.getItem('banner-hidden')||'0')) {
                document.documentElement.classList.add('banner-hidden')
              }
            }catch(err){}
          })()`}
        </script>
        <script>{`;(function(){document.documentElement.classList.add('has-banner')})()`}</script>
      </Head>
      <div role="banner" id="banner" className="relative hidden w-full bg-lp-secondary p-2 text-black">
        <p className="mr-6 text-center text-xs">
          Always make sure the URL is <strong>llamapay.io</strong> - Press (Ctrl+D or Cmd+D) to bookmark it to be safe.
        </p>
        <button className="absolute right-0 top-0 h-full p-2 md:right-8" onClick={hideBanner}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M11.8256 1.34175L10.6506 0.166748L5.99227 4.82508L1.33394 0.166748L0.158936 1.34175L4.81727 6.00008L0.158936 10.6584L1.33394 11.8334L5.99227 7.17508L10.6506 11.8334L11.8256 10.6584L7.16727 6.00008L11.8256 1.34175Z"
              fill="#4E575F"
            />
          </svg>
        </button>
      </div>
    </>
  );
};

export default Banner;
