import { BookOpenIcon, PlayIcon } from '@heroicons/react/outline';
import { DisclosureState } from 'ariakit';
import { Menu, MenuItem } from 'components/NestedMenu';
import { useLocale } from 'hooks';
import { useTranslations } from 'next-intl';

export default function HeaderMenu({ onboardDialog }: { onboardDialog: DisclosureState }) {
  const { locales, updateLocale } = useLocale();

  const t1 = useTranslations('Common');
  const t2 = useTranslations('Header');

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
            <span className="cursor-pointer">{t1('getStarted')}</span>
            <PlayIcon className="h-4 w-4" />
          </>
        }
        onClick={onboardDialog.toggle}
      />

      <Menu label={t2('language')}>
        {locales.map((locale) => (
          <MenuItem
            label={locale.name}
            key={locale.id}
            className="cursor-pointer py-1"
            onClick={() => updateLocale(locale.id)}
          />
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
            <span>{t2('docs')}</span>
            <BookOpenIcon className="h-4 w-4" />
          </a>
        }
      />
    </Menu>
  );
}
