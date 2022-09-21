import Image from 'next/image';
import curveLogo from './curve.png';

export default function Curve() {
  return (
    <span className="flex min-w-[100px] items-center gap-2 text-xl text-lp-gray-8 dark:text-lp-white">
      <Image src={curveLogo} alt="curve finance" height={28} width={28} objectFit="contain" priority />
      <p className="font-serif">Curve</p>
    </span>
  );
}
