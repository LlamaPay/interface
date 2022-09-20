import Image from 'next/image';
import curveLogo from './curve.png';

export default function Curve() {
  return <Image src={curveLogo} alt="curve finance" height={28} width={28} objectFit="contain" priority />;
}
