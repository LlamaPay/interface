import { HTMLAttributes, ReactNode, RefAttributes, createContext, forwardRef, useContext } from 'react';
import { Menu as BaseMenu, MenuItem as BaseMenuItem, MenuButton, MenuButtonArrow, useMenuState } from 'ariakit/menu';

// Use React Context so we can determine if the menu is a submenu or not.
const MenuContext = createContext(false);

export type MenuItemProps = HTMLAttributes<HTMLDivElement> & {
  label: ReactNode;
  disabled?: boolean;
};

export const MenuItem = forwardRef<HTMLDivElement, MenuItemProps>(function A({ label, ...props }, ref) {
  return (
    <BaseMenuItem
      className="flex scroll-m-2 items-center justify-between gap-4 p-2 font-normal text-[#666666] outline-none active-item:text-black aria-disabled:opacity-40 dark:bg-[#202020] dark:text-white dark:hover:text-[#cccccc]"
      ref={ref}
      {...props}
    >
      {label}
    </BaseMenuItem>
  );
});

export type MenuProps = HTMLAttributes<HTMLDivElement> & {
  label: ReactNode;
  disabled?: boolean;
};

type MenuButtonProps = HTMLAttributes<HTMLDivElement> & RefAttributes<HTMLDivElement>;

export const Menu = forwardRef<HTMLDivElement, MenuProps>(function B({ label, children, ...props }, ref) {
  const inSubmenu = useContext(MenuContext);
  const menu = useMenuState({
    gutter: 8,
    shift: inSubmenu ? -9 : 0,
  });

  const renderMenuButton = (menuButtonProps: MenuButtonProps) => (
    <MenuButton
      state={menu}
      className="shadow-1 rounded-2xl border border-[#f7f8fa] bg-white py-2 px-4 text-[#3D3D3D] dark:border-[#202020] dark:bg-[#202020] dark:text-[#23BD8F]"
      {...menuButtonProps}
    >
      {label}
    </MenuButton>
  );

  const renderSubMenuButton = (menuButtonProps: MenuButtonProps) => (
    <MenuButton state={menu} {...menuButtonProps}>
      <span>{label}</span>
      <MenuButtonArrow />
    </MenuButton>
  );

  return (
    <>
      {inSubmenu ? (
        // If it's a submenu, we have to combine the MenuButton and the
        // MenuItem components into a single component, so it works as a
        // submenu button.
        <BaseMenuItem
          className="flex scroll-m-2 items-center justify-between gap-4 p-2 font-normal text-[#666666] outline-none active-item:text-black aria-disabled:opacity-40 dark:bg-[#202020] dark:text-white"
          ref={ref}
          {...props}
        >
          {renderSubMenuButton}
        </BaseMenuItem>
      ) : (
        // Otherwise, we just render the menu button.
        renderMenuButton({ ref, ...props })
      )}
      <BaseMenu
        state={menu}
        className="shadow-2 z-10 min-w-[10rem] rounded-xl border border-[#EAEAEA] bg-white p-2 dark:border-[#252525] dark:bg-[#202020] "
      >
        <MenuContext.Provider value={true}>{children}</MenuContext.Provider>
      </BaseMenu>
    </>
  );
});
