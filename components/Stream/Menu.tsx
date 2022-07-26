import { ChipIcon, ShareIcon, TrashIcon } from '@heroicons/react/outline';
import { DotsVerticalIcon } from '@heroicons/react/solid';
import { useDialogState } from 'ariakit';
import { Menu, MenuButton, MenuItem, useMenuState } from 'ariakit/menu';
import DisperseGasMoney from 'components/DisperseGas';
import { FuelIcon, WalletIcon } from 'components/Icons';
import BotFunds from 'components/Schedule/BotManage';
import WithdrawAll from 'components/WithdrawAll';
import { useNetworkProvider } from 'hooks';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import { useAccount, useEnsLookup } from 'wagmi';

export default function StreamMenu() {
  const menu = useMenuState({ gutter: 8 });

  const { nativeCurrency, unsupported, chainId } = useNetworkProvider();
  const [{ data: accountData }] = useAccount();
  const { network } = useNetworkProvider();

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
        className="secondary-button shadow-1 cursor-pointer px-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 dark:bg-[#202020]"
        disabled={!accountData || unsupported}
        style={{ pointerEvents: 'initial' }}
      >
        <span className="sr-only">Open Streams Menu</span>
        <DotsVerticalIcon className="h-4 w-4" />
      </MenuButton>
      <Menu
        state={menu}
        onClick={botDialog.toggle}
        className="shadow-2 z-10 min-w-[10rem] rounded-xl border border-[#EAEAEA] bg-white p-2 dark:border-[#252525] dark:bg-[#202020]"
      >
        <MenuItem className="flex cursor-pointer scroll-m-2 items-center justify-between gap-4 p-2 text-sm font-normal text-[#666666] outline-none active-item:text-black aria-disabled:opacity-40 dark:bg-[#202020] dark:text-white dark:hover:text-[#cccccc]">
          <span className="dark:text-white dark:hover:text-[#cccccc]">Manage Bot</span>
          <ChipIcon className="h-4 w-4" />
        </MenuItem>
        <MenuItem
          className="flex cursor-pointer scroll-m-2 items-center justify-between gap-4 p-2 text-sm font-normal text-[#666666] outline-none active-item:text-black aria-disabled:opacity-40 dark:bg-[#202020] dark:text-white dark:hover:text-[#cccccc]"
          onClick={disperseGasGialog.toggle}
        >
          <span className="dark:text-white dark:hover:text-[#cccccc]">{`${t('disperse')} ${
            nativeCurrency?.symbol ? nativeCurrency?.symbol : 'Funds'
          }`}</span>
          <FuelIcon />
        </MenuItem>
        <MenuItem
          className="flex cursor-pointer scroll-m-2 items-center justify-between gap-4 p-2 text-sm font-normal text-[#666666] outline-none active-item:text-black aria-disabled:opacity-40 dark:bg-[#202020] dark:text-white dark:hover:text-[#cccccc]"
          onClick={() => router.push('/withdraw')}
        >
          <span className="dark:text-white dark:hover:text-[#cccccc]">{t('withdrawAnotherWallet')}</span>
          <WalletIcon />
        </MenuItem>
        <MenuItem className="flex scroll-m-2 items-center justify-between gap-4 p-2 text-sm font-normal text-[#666666] outline-none active-item:text-black aria-disabled:opacity-40 dark:bg-[#202020] dark:hover:text-[#cccccc]">
          <WithdrawAll />
        </MenuItem>
        <MenuItem className="flex cursor-pointer scroll-m-2 items-center justify-between gap-4 p-2 text-sm font-normal text-[#666666] outline-none active-item:text-black aria-disabled:opacity-40 dark:bg-[#202020] dark:text-white dark:hover:text-[#cccccc]">
          <a href={shareableUrl} target="_blank" rel="noreferrer noopener">
            {'Show Public Page'}
          </a>
          <ShareIcon className="h-4 w-4" />
        </MenuItem>
        <MenuItem
          className="flex cursor-pointer scroll-m-2 items-center justify-between gap-4 p-2 text-sm font-normal text-[#666666] outline-none active-item:text-black aria-disabled:opacity-40 dark:bg-[#202020] dark:text-white dark:hover:text-[#cccccc]"
          onClick={clearLocalStorage}
        >
          <span className="dark:text-white dark:hover:text-[#cccccc]">{'Clear Names'}</span>
          <TrashIcon className="h-4 w-4" />
        </MenuItem>
      </Menu>
      <DisperseGasMoney dialog={disperseGasGialog} />
      {chainId && accountData ? (
        <BotFunds
          dialog={botDialog}
          chainId={chainId}
          accountAddress={accountData?.address}
          nativeCurrency={nativeCurrency?.symbol}
        />
      ) : (
        ''
      )}
    </>
  );
}
