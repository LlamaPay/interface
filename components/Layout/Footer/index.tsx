// import AnteWidget from '@antefinance/ante-widget-react';
// import '@antefinance/ante-widget/dist/widget.css';

import { NeutralLogo } from 'components/Icons';
import Image from 'next/image';
import graphic from './graphic.png';

const Footer = () => {
  return (
    <footer className="relative mt-20 flex flex-col flex-wrap gap-12 bg-lp-gray-5 p-[30px] text-lp-white md:px-[30px] lg:min-h-[420px] lg:p-[60px] xl:min-h-[510px] xl:flex-row xl:justify-between xl:p-[120px]">
      <div className="z-10 flex flex-col gap-4 2xl:gap-8">
        <NeutralLogo />
        <p className="flex w-fit flex-wrap gap-[2px] rounded text-base text-lp-secondary backdrop-blur-xl xl:flex-col xl:text-xl">
          <span>© LlamaPay 2022.</span> <span>All rights reserved.</span>
        </p>
      </div>
      <div className="z-10 flex flex-wrap gap-12 rounded text-lg sm:gap-20 md:flex-row xl:mr-[360px] xl:text-2xl 2xl:mr-[400px]">
        <div className="flex flex-col gap-4">
          <h3 className="w-fit rounded font-bold backdrop-blur-xl">Community</h3>
          <ul className="flex w-fit flex-col gap-2 rounded backdrop-blur-xl md:gap-4">
            <li>Twitter</li>
            <li>Discord</li>
          </ul>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="w-fit rounded font-bold backdrop-blur-xl">Resources</h3>
          <ul className="flex w-fit flex-col gap-2 rounded backdrop-blur-xl md:gap-4">
            <li>Documentation</li>
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
// relative top-[-135px] right-[-145px]
