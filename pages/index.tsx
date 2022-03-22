import type { NextPage } from 'next';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import Logo from '../public/logo.jpeg';
import Layout from '../components/Layout';

const Home: NextPage = () => {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <Layout className="items-center justify-center">
      <h1 className="mb-8 text-3xl">LlamaPay</h1>
      <Image src={Logo} alt="Logo of Llamapay" width="300px" height="300px" placeholder="blur" />
      <button className="mt-4" onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>
        Toggle Theme
      </button>
    </Layout>
  );
};

export default Home;
