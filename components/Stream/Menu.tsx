import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import { ShareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid';
import { useDialogState } from 'ariakit';
import { Menu, MenuButton, MenuItem, useMenuState } from 'ariakit/menu';
import { useAccount, useEnsLookup } from 'wagmi';
import DisperseGasMoney from '~/components/DisperseGas';
import { FuelIcon, RobotIcon, WalletIcon } from '~/components/Icons';
import WithdrawAll from '~/components/WithdrawAll';
import { useNetworkProvider } from '~/hooks';

import { botDeployedOn } from '~/utils/constants';
import BotFunds from '~/components/Schedule/BotManage';

export default function StreamMenu() {
  const menu = useMenuState({ gutter: 8 });

  const { nativeCurrency, unsupported, network, chainId } = useNetworkProvider();
  const [{ data: accountData }] = useAccount();

  const [{ data: ensName }] = useEnsLookup({
    address: accountData?.address,
  });

  const shareableUrl = `/salaries/${network}/${ensName ?? accountData?.address}`;

  const disperseGasGialog = useDialogState();
  const botDialog = useDialogState();

  const t = useTranslations('Streams');

  const router = useRouter();

  function clearLocalStorage() {
    localStorage.removeItem('llama-address-book');
    window.location.reload();
  }

  return (
    <>
      <MenuButton
        state={menu}
        className="secondary-button shadow-1 min-h-[36px] cursor-pointer px-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 dark:bg-[#202020] dark:text-lp-secondary"
        disabled={!accountData || unsupported}
        style={{ pointerEvents: 'initial' }}
      >
        <span className="sr-only">Open Streams Menu</span>
        <EllipsisVerticalIcon className="h-4 w-4" />
      </MenuButton>

      <Menu
        state={menu}
        className="shadow-2 z-10 min-w-[10rem] rounded-xl border border-[#EAEAEA] bg-white p-2 dark:border-[#252525] dark:bg-lp-gray-4"
      >
        {chainId && accountData && botDeployedOn.includes(chainId) && (
          <MenuItem className={itemClassname} onClick={botDialog.toggle}>
            <span>Manage Bot</span>
            <RobotIcon />
          </MenuItem>
        )}

        <MenuItem className={itemClassname} onClick={disperseGasGialog.toggle}>
          <span>{`${t('disperse')} ${nativeCurrency?.symbol ? nativeCurrency?.symbol : 'Funds'}`}</span>
          <FuelIcon />
        </MenuItem>
        <MenuItem className={itemClassname} onClick={() => router.push('/withdraw')}>
          <span>{t('withdrawAnotherWallet')}</span>
          <WalletIcon />
        </MenuItem>
        <MenuItem className={itemClassname}>
          <WithdrawAll />
        </MenuItem>
        <MenuItem className={itemClassname}>
          <a href={shareableUrl} target="_blank" rel="noreferrer noopener">
            {'Show Public Page'}
          </a>
          <ShareIcon className="h-4 w-4" />
        </MenuItem>
        <MenuItem className={itemClassname} onClick={clearLocalStorage}>
          <span>Clear Names</span>
          <TrashIcon className="h-4 w-4" />
        </MenuItem>
      </Menu>

      <DisperseGasMoney dialog={disperseGasGialog} />

      {chainId && accountData && botDeployedOn.includes(chainId) && (
        <BotFunds
          dialog={botDialog}
          chainId={chainId}
          accountAddress={accountData?.address}
          nativeCurrency={nativeCurrency?.symbol}
        />
      )}
    </>
  );
}

const itemClassname =
  'flex cursor-pointer scroll-m-2 items-center justify-between gap-4 p-2 text-sm font-normal text-lp-gray-2 outline-none active-item:text-black aria-disabled:opacity-40 dark:text-white dark:hover:text-[#cccccc]';
