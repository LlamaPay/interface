// import AnteWidget from '@antefinance/ante-widget-react';
// import '@antefinance/ante-widget/dist/widget.css';

import { NeutralLogo } from 'components/Icons';
import Image from 'next/image';
import footerGraphic from 'public/footerGraphic.svg';

// TODO add translations
// TODO add ante widget
const Footer = () => {
  return (
    <footer className="relative mt-20 flex flex-col flex-wrap gap-12 bg-lp-gray-5 p-[1.875rem] text-lp-white lg:min-h-[26.25rem] lg:p-[3.75rem] xl:min-h-[30rem] xl:flex-row xl:justify-between xl:px-[145px] xl:py-[125px]">
      <div className="z-10 flex flex-col gap-4 2xl:gap-8">
        <NeutralLogo />
        <p className="flex w-fit flex-wrap gap-[2px] rounded text-sm text-lp-secondary backdrop-blur-xl lg:text-base xl:flex-col">
          <span>© LlamaPay 2022.</span> <span>All rights reserved.</span>
        </p>
      </div>

      <div className="z-10 flex flex-wrap gap-12 rounded sm:gap-24 md:flex-row xl:mr-[21.25rem] xl:text-lg 2xl:mr-[25rem]">
        <div className="flex flex-col gap-4">
          <h3 className="font-exo w-fit rounded text-xl font-bold backdrop-blur-xl xl:text-2xl">Community</h3>
          <ul className="flex w-fit flex-col gap-2 rounded backdrop-blur-xl md:gap-4">
            <li>
              <a href="https://twitter.com/llamapay_io/" target="_blank" rel="noreferrer noopener">
                Twitter
              </a>
            </li>
            <li>
              <a href="https://discord.gg/buPFYXzDDd" target="_blank" rel="noreferrer noopener">
                Discord
              </a>
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="font-exo w-fit rounded text-xl font-bold backdrop-blur-xl xl:text-2xl">Resources</h3>
          <ul className="flex w-fit flex-col gap-2 rounded backdrop-blur-xl md:gap-4">
            <li>
              <a href="https://docs.llamapay.io/" target="_blank" rel="noreferrer noopener">
                Documentation
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-graphic">
        <Image src={footerGraphic} alt="" objectFit="contain" />
      </div>
    </footer>
  );
};
export default Footer;

//  <AnteWidget.Protocol name="LlamaPay" chain="0x1" />
