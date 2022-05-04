import { DotsVerticalIcon } from '@heroicons/react/solid';
import { useDialogState } from 'ariakit';
import { Menu, MenuButton, MenuItem, useMenuState } from 'ariakit/menu';
import DisperseGasMoney from 'components/DisperseGas';
import { FuelIcon, WalletIcon } from 'components/Icons';
import WithdrawAll from 'components/WithdrawAll';
import { useNetworkProvider } from 'hooks';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';

export default function StreamMenu() {
  const menu = useMenuState({ gutter: 8 });

  const { nativeCurrency, unsupported } = useNetworkProvider();
  const [{ data: accountData }] = useAccount();

  const disperseGasGialog = useDialogState();

  const t = useTranslations('Streams');

  const router = useRouter();

  return (
    <>
      <MenuButton
        state={menu}
        className="secondary-button shadow-1 cursor-pointer px-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
        disabled={!accountData || unsupported}
        style={{ pointerEvents: 'initial' }}
      >
        <DotsVerticalIcon className="h-4 w-4" />
      </MenuButton>
      <Menu state={menu} className="shadow-2 z-10 min-w-[10rem] rounded-xl border border-[#EAEAEA] bg-white p-2">
        <MenuItem
          className="flex cursor-pointer scroll-m-2 items-center justify-between gap-4 p-2 text-sm font-normal text-[#666666] outline-none active-item:text-black aria-disabled:opacity-40"
          onClick={disperseGasGialog.toggle}
        >
          <span>{`${t('disperse')} ${nativeCurrency?.symbol ? nativeCurrency?.symbol : 'Funds'}`}</span>
          <FuelIcon />
        </MenuItem>
        <MenuItem
          className="flex cursor-pointer scroll-m-2 items-center justify-between gap-4 p-2 text-sm font-normal text-[#666666] outline-none active-item:text-black aria-disabled:opacity-40"
          onClick={() => router.push('/withdraw')}
        >
          <span>{t('withdrawAnotherWallet')}</span>
          <WalletIcon />
        </MenuItem>
        <MenuItem className="flex scroll-m-2 items-center justify-between gap-4 p-2 text-sm font-normal text-[#666666] outline-none active-item:text-black aria-disabled:opacity-40">
          <WithdrawAll />
        </MenuItem>
      </Menu>

      <DisperseGasMoney dialog={disperseGasGialog} />
    </>
  );
}
