import { useNetwork } from 'wagmi';
import { networkDetails } from '~/lib/networkDetails';
import { INonRefundable } from '~/queries/useGetSubscriptions';
import { formatFrequency } from '../ScheduledTransfers/utils';

export function NonRefundableTable({ data }: { data: Array<INonRefundable> }) {
  const { chain } = useNetwork();

  const explorerUrl = chain ? networkDetails[chain.id]?.blockExplorerURL : null;

  return (
    <div className="flex flex-col gap-2">
      {data.map((contract) => (
        <div
          key={'non-refundable-subs' + contract.id}
          className="max-w-[calc(100vw-16px)] overflow-x-auto md:max-w-[calc(100vw-48px)] lg:max-w-[calc(100vw-256px)]"
        >
          <table className="w-full border-collapse">
            <tbody className="border border-llama-teal-2 dark:border-lp-gray-7">
              <tr>
                <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-center text-sm font-normal dark:border-lp-gray-7">
                  Address
                </th>
                <td className="table-description border border-solid border-llama-teal-2 text-center text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
                  {explorerUrl ? (
                    <a
                      href={`${explorerUrl}/address/${contract.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      {contract.address}
                    </a>
                  ) : (
                    contract.address
                  )}
                </td>
              </tr>

              <tr>
                <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-center text-sm font-normal dark:border-lp-gray-7">
                  Subs
                </th>
                <td className="table-description border border-solid border-llama-teal-2 text-center text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-center text-sm font-normal dark:border-lp-gray-7">
                          Cost
                        </th>
                        <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-center text-sm font-normal dark:border-lp-gray-7">
                          Duration
                        </th>
                      </tr>
                    </thead>
                    <tbody className="border border-llama-teal-2 dark:border-lp-gray-7">
                      {contract.subs.map((sub) => (
                        <tr key={sub.id + contract.id + 'nonrefundablessub'}>
                          <td className="table-description border border-solid border-llama-teal-2 text-center text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
                            <span>{sub.costOfSub}</span>{' '}
                            {explorerUrl ? (
                              <a
                                href={`${explorerUrl}/address/${sub.token.address}`}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="underline"
                              >
                                {sub.token.symbol}
                              </a>
                            ) : (
                              <span>{sub.token.symbol}</span>
                            )}
                          </td>
                          <td className="table-description border border-solid border-llama-teal-2 text-center text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
                            {formatFrequency(sub.duration)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-center text-sm font-normal dark:border-lp-gray-7">
                  Whitelist
                </th>
                <td className="table-description border border-solid border-llama-teal-2 text-center text-lp-gray-4 dark:border-lp-gray-7 dark:text-white"></td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
