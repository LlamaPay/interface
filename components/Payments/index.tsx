import classNames from 'classnames';
import Fallback, { FallbackContainer } from 'components/Fallback';
import { useNetworkProvider } from 'hooks';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import useGetPaymentsInfo from 'queries/useGetPaymentsInfo';
import { networkDetails } from 'utils/constants';
import PaymentsTableActual from './Table';

export default function PaymentsTable() {
  const { chainId } = useNetworkProvider();
  const { data, isLoading, error } = useGetPaymentsInfo();
  const paymentsContract = chainId
    ? networkDetails[chainId].paymentsContract
      ? networkDetails[chainId].paymentsContract
      : null
    : null;
  const unsupported = paymentsContract ? false : true;
  const t0 = useTranslations('Common');

  return (
    <section className="w-full">
      <div className="section-header flex w-full flex-wrap items-center justify-between">
        <h1 className="font-exo">Payments</h1>
        <Link href="/payments/create" aria-disabled={!paymentsContract}>
          <a
            className={classNames(
              'primary-button text-md py-2 px-5 text-center font-bold',
              !paymentsContract && 'pointer-events-none opacity-50 hover:cursor-not-allowed'
            )}
            aria-disabled={!paymentsContract}
          >
            {'Create Payment'}
          </a>
        </Link>
      </div>
      {isLoading || error || !data || data.length < 1 || unsupported ? (
        unsupported ? (
          <FallbackContainer>
            <p>Network Not Supported</p>
          </FallbackContainer>
        ) : (
          <Fallback
            isLoading={isLoading}
            isError={error ? true : false}
            noData={true}
            type={'payments'}
            showLoader={true}
          />
        )
      ) : (
        <PaymentsTableActual data={data} />
      )}
    </section>
  );
}
