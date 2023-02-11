import {
  BanknotesIcon,
  CogIcon,
  InboxArrowDownIcon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import Tooltip from '~/components/Tooltip';
import { useChainExplorer } from '~/hooks';
import { useTranslations } from 'next-intl';
import type { IHistory } from '~/types';

export function ActionName({ data }: { data: IHistory }) {
  const { url: chainExplorer, id } = useChainExplorer();

  const link = id === 82 || id === 1088 ? `${chainExplorer}tx/${data.txHash}` : `${chainExplorer}/tx/${data.txHash}`;

  const t0 = useTranslations('Common');
  const t1 = useTranslations('History');

  return (
    <div className="flex justify-center">
      {data.eventType === 'StreamModified' ? (
        <Tooltip content={t1('streamModified')}>
          <div className="rounded bg-yellow-100 p-1 text-yellow-600">
            <a href={link} target="_blank" rel="noreferrer noopener">
              <span className="sr-only">{t1('viewTransactionOnExplorer', { name: 'chain explorer' })}</span>
              <CogIcon className="h-4 w-4" />
            </a>
          </div>
        </Tooltip>
      ) : data.eventType === 'StreamCreated' ? (
        <Tooltip content={t1('streamCreated')}>
          <div className="rounded bg-green-100 p-1 text-green-600">
            <a href={link} target="_blank" rel="noreferrer noopener">
              <span className="sr-only">{t1('viewTransactionOnExplorer', { name: 'chain explorer' })}</span>
              <PlusIcon className="h-4 w-4" />
            </a>
          </div>
        </Tooltip>
      ) : data.eventType === 'StreamCancelled' ? (
        <Tooltip content={t1('streamCancelled')}>
          <div className="rounded bg-red-100 p-1 text-red-600">
            <a href={link} target="_blank" rel="noreferrer noopener">
              <span className="sr-only">{t1('viewTransactionOnExplorer', { name: 'chain explorer' })}</span>
              <XMarkIcon className="h-4 w-4" />
            </a>
          </div>
        </Tooltip>
      ) : data.eventType === 'Withdraw' || data.eventType === 'PayerWithdraw' ? (
        <Tooltip content="Withdraw">
          <div className="rounded bg-green-100 p-1 text-green-600">
            <a href={link} target="_blank" rel="noreferrer noopener">
              <span className="sr-only">{t1('viewTransactionOnExplorer', { name: 'chain explorer' })}</span>
              <BanknotesIcon className="h-4 w-4" />
            </a>
          </div>
        </Tooltip>
      ) : data.eventType === 'Deposit' ? (
        <Tooltip content={t0('deposit')}>
          <div className="rounded bg-green-100 p-1 text-green-600">
            <a href={link} target="_blank" rel="noreferrer noopener">
              <span className="sr-only">{t1('viewTransactionOnExplorer', { name: 'chain explorer' })}</span>
              <InboxArrowDownIcon className="h-4 w-4" />
            </a>
          </div>
        </Tooltip>
      ) : data.eventType === 'StreamPaused' ? (
        <Tooltip content={t0('pause')}>
          <div className="rounded bg-yellow-100 p-1 text-yellow-600">
            <a href={link} target="_blank" rel="noreferrer noopener">
              <span className="sr-only">{t1('viewTransactionOnExplorer', { name: 'chain explorer' })}</span>
              <PauseIcon className="h-4 w-4" />
            </a>
          </div>
        </Tooltip>
      ) : data.eventType === 'StreamResumed' ? (
        <Tooltip content={t0('resume')}>
          <div className="rounded bg-green-100 p-1 text-green-600">
            <a href={link} target="_blank" rel="noreferrer noopener">
              <span className="sr-only">{t1('viewTransactionOnExplorer', { name: 'chain explorer' })}</span>
              <PlayIcon className="h-4 w-4" />
            </a>
          </div>
        </Tooltip>
      ) : (
        ''
      )}
    </div>
  );
}
