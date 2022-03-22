import type { NextPage } from 'next';
import Image from 'next/image';
import { useTheme } from 'next-themes';

const Home: NextPage = () => {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Image src="/logo.jpeg" alt="Logo of Llamapay" width={300} height={300} placeholder="blur" />
      <button className="mt-4" onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>
        Toggle Theme
      </button>
    </div>
  );
};

export default Home;
