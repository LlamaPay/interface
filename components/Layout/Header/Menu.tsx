import { BookOpenIcon, GlobeAltIcon, PlayIcon } from '@heroicons/react/outline';
import { DisclosureState } from 'ariakit';
import { Menu, MenuButton, MenuItem, useMenuState } from 'ariakit/menu';
import classNames from 'classnames';

export default function HeaderMenu({
  onboardDialog,
  className,
}: {
  onboardDialog: DisclosureState;
  className?: string;
}) {
  const menu = useMenuState({ gutter: 8 });
  return (
    <>
      <MenuButton
        state={menu}
        className={classNames(
          'shadow-1 rounded-2xl border border-[#f7f8fa] bg-white py-2 px-4 text-[#3D3D3D]',
          className
        )}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
        </svg>
      </MenuButton>
      <Menu state={menu} className="shadow-2 z-10 min-w-[10rem] rounded-xl border border-[#EAEAEA] bg-white p-2">
        <MenuItem
          className="flex scroll-m-2 items-center justify-between gap-4 p-2 font-normal text-[#666666] outline-none active-item:text-black aria-disabled:opacity-40"
          onClick={onboardDialog.toggle}
        >
          <span>Get Started</span>
          <PlayIcon className="h-4 w-4" />
        </MenuItem>
        <MenuItem className="flex scroll-m-2 items-center justify-between gap-4 p-2 font-normal text-[#666666] outline-none active-item:text-black aria-disabled:opacity-40">
          <span>Language</span>
          <GlobeAltIcon className="h-4 w-4" />
        </MenuItem>
        <MenuItem
          className="flex scroll-m-2 items-center justify-between gap-4 p-2 font-normal text-[#666666] outline-none active-item:text-black aria-disabled:opacity-40"
          as="a"
          href="https://docs.llamapay.io/"
          target="_blank"
          rel="noreferrer noopener"
        >
          <span>Docs</span>
          <BookOpenIcon className="h-4 w-4" />
        </MenuItem>
      </Menu>
    </>
  );
}
