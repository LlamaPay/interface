import type { NextPage } from 'next';
import Layout from 'components/Layout';
import { StreamList } from 'components/Stream';

// const myHeaders = new Headers();
// myHeaders.append('Content-Type', 'application/json');

// const raw = JSON.stringify({
//   coins: ['ethereum:0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'],
//   timestamp: 1603964988,
// });

// const requestOptions = {
//   method: 'POST',
//   headers: myHeaders,
//   body: raw,
//   redirect: 'follow',
// };

const Home: NextPage = () => {
  // fetch('https://coins.llama.fi/prices', requestOptions)
  //   .then((response) => response.text())
  //   .then((result) => console.log(result))
  //   .catch((error) => console.log('error', error));

  return (
    <Layout>
      <div className="flex items-center space-x-4">
        <h1>Streams</h1>
        {/* <button className="rounded border border-zinc-200 py-[6px] px-2  hover:bg-zinc-100 dark:border-zinc-700 hover:dark:bg-zinc-800">
          Create
        </button> */}
      </div>
      <div className="mt-2 flex flex-col border dark:border-zinc-800">
        <StreamList />
      </div>
    </Layout>
  );
};

export default Home;
