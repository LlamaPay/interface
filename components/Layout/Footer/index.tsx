// import AnteWidget from '@antefinance/ante-widget-react';
// import '@antefinance/ante-widget/dist/widget.css';

import { NeutralLogo } from 'components/Icons';
import Image from 'next/image';
import graphic from './graphic.png';

// TODO add translations
// TODO add ante widget
const Footer = () => {
  return (
    <footer className="relative mt-20 flex flex-col flex-wrap gap-12 bg-lp-gray-5 p-[30px] text-lp-white lg:min-h-[420px] lg:p-[60px] xl:min-h-[480px] xl:flex-row xl:justify-between xl:p-[120px]">
      <div className="z-10 flex flex-col gap-4 2xl:gap-8">
        <NeutralLogo />
        <p className="flex w-fit flex-wrap gap-[2px] rounded text-sm text-lp-secondary backdrop-blur-xl lg:text-base xl:flex-col">
          <span>© LlamaPay 2022.</span> <span>All rights reserved.</span>
        </p>
      </div>

      <div className="z-10 flex flex-wrap gap-12 rounded sm:gap-20 md:flex-row xl:mr-[360px] xl:text-lg 2xl:mr-[480px]">
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
        <Image src={graphic} alt="" objectFit="contain" />
      </div>
    </footer>
  );
};
export default Footer;

//  <AnteWidget.Protocol name="LlamaPay" chain="0x1" />
