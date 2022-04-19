import { StreamCircle } from 'components/Icons';

export default function Hero() {
  return (
    <section className="relative mb-[30px] flex flex-col flex-wrap gap-6 bg-[#D9F2F4] px-2 py-[52px] text-[#303030] sm:flex-row sm:items-center sm:justify-center">
      {/* <button className="absolute right-3 top-3 p-2">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z"
            fill="#4E575F"
          />
        </svg>
      </button> */}
      <div className="relative left-[-12px] flex-shrink-0">
        <StreamCircle />
      </div>
      <h1 className="box-decoration-clone text-3xl font-bold lg:text-4xl">
        <span className="whitespace-nowrap">Stream seamless</span>{' '}
        <span className="hero-word-break whitespace-nowrap">recurring payments</span>{' '}
        <span className="hero-word-break">in crypto!</span>
      </h1>
      <p className="font-inter max-w-md 2xl:max-w-xl">
        Automate salary txs, streaming them by the second so employees can withdraw whenever they want and you don't
        have to deal with sending txs manually.
      </p>
    </section>
  );
}
