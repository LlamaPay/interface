import { BookOpenIcon, PlayIcon } from '@heroicons/react/outline';
import { DisclosureState } from 'ariakit';
import { Menu, MenuItem } from 'components/NestedMenu';
import { useLocale } from 'hooks';
import { useTranslation } from 'next-i18next';

export default function HeaderMenu({ onboardDialog }: { onboardDialog: DisclosureState }) {
  const { locales, updateLocale } = useLocale();

  const { t: common } = useTranslation('common');
  const { t } = useTranslation('header');

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
            <span>{common('getStarted')}</span>
            <PlayIcon className="h-4 w-4" />
          </>
        }
        onClick={onboardDialog.toggle}
      />

      <Menu label={t('language')}>
        {locales.map((locale) => (
          <MenuItem label={locale.name} key={locale.id} onClick={() => updateLocale(locale.id)} />
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
            <span>{t('docs')}</span>
            <BookOpenIcon className="h-4 w-4" />
          </a>
        }
      />
    </Menu>
  );
}
