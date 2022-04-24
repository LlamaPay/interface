import { BookOpenIcon, PlayIcon } from '@heroicons/react/outline';
import { DisclosureState } from 'ariakit';
import { Menu, MenuItem } from 'components/NestedMenu';
import { useLocale } from 'hooks';

export default function HeaderMenu({ onboardDialog }: { onboardDialog: DisclosureState }) {
  const { locales, updateLocale } = useLocale();

  return (
    <Menu
      label={
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
        </svg>
      }
    >
      <MenuItem
        label={
          <>
            <span>Get Started</span>
            <PlayIcon className="h-4 w-4" />
          </>
        }
        onClick={onboardDialog.toggle}
      />

      <Menu label="Language">
        {locales.map((locale) => (
          <MenuItem label={locale} key={locale} onClick={() => updateLocale(locale)} />
        ))}
      </Menu>
      <MenuItem
        label={
          <a
            href="https://docs.llamapay.io/"
            target="_blank"
            rel="noreferrer noopener"
            className="flex w-full items-center justify-between gap-4 font-normal"
          >
            <span>Docs</span>
            <BookOpenIcon className="h-4 w-4" />
          </a>
        }
      />
    </Menu>
  );
}
