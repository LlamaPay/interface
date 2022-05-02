import { useTranslations } from 'next-intl';

export function EventType({ event, addressType }: { event: string; addressType: string }) {
  let eventType = '';

  const t0 = useTranslations('Common');
  const t1 = useTranslations('History');

  switch (event) {
    case 'Deposit':
      eventType = t0('deposit');
      break;
    case 'StreamPaused':
      eventType = t0('pause');
      break;
    case 'StreamResumed':
      eventType = t0('resume');
      break;
    case 'Withdraw':
      eventType = t0('withdraw');
      break;
    case 'StreamCreated':
      eventType = addressType === 'payer' ? t1('createStream') : t1('receiveStream');
      break;
    case 'StreamCancelled':
      eventType = t1('cancelStream');
      break;
    case 'StreamModified':
      eventType = t1('modifyStream');
      break;
    case 'PayerWithdraw':
      eventType = t0('withdraw');
      break;
    default:
      eventType = '';
  }

  return <>{eventType}</>;
}
