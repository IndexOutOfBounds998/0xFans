import { msg, Trans } from '@lingui/macro';
import { MessageDescriptor } from '@lingui/core';
import cn from 'clsx';
import { HeroIcon } from '@components/ui/hero-icon';
import { useRouter } from 'next/router';
import { useLingui } from '@lingui/react';
import { Button } from '@components/ui/button';
import { useState } from 'react';

type ModalProps = {
  closeModal: () => void;
};

type LOCALES = 'en-us' | 'zh-CN';

const languages: { [key: string]: MessageDescriptor } = {
  'en-us': msg`English`,
  'zh-CN': msg`Chinese`
};

export function LanguagesModal({ closeModal }: ModalProps): JSX.Element {
  const router = useRouter();
  const {
    query: { id },
    back,
    locale: localeRouter
  } = useRouter();

  const [locale, setLocale] = useState<LOCALES>(localeRouter as LOCALES);

  const { i18n } = useLingui();

  function handleChange() {
    if (localeRouter === locale) {
      closeModal();
      return;
    }
    if (id) {
      let path = router.pathname.replace('[id]', id);
      router.push(router.pathname, path, { locale });
    } else {
      router.push(router.pathname, router.pathname, { locale });
    }
  }
  return (
    <div className='flex flex-col items-center gap-6'>
      <div className='flex flex-col gap-3 text-center'>
        <h2 className='text-2xl font-bold'>
          <Trans>Customize your view</Trans>
        </h2>
        <p className='text-light-secondary dark:text-dark-secondary'>
          <Trans>
            These settings affect all the 0xFans accounts on this browser.
          </Trans>
        </p>
      </div>
      <div className='flex w-full flex-col gap-1'>
        <p className='text-sm font-bold text-light-secondary dark:text-dark-secondary'>
          <Trans>Language</Trans>
        </p>
        <div
          className='hover-animation grid gap-3 rounded-2xl bg-main-sidebar-background
                     px-4 py-3'
        >
          {Object.keys(languages).map((item) => (
            <label
              className={cn(
                `flex cursor-pointer items-center gap-2 rounded p-3 font-bold ring-main-accent transition
                        duration-200 [&:has(div>input:checked)]:ring-2`,
                'text-center',
                'bg-main-background',
                '[&:hover>div]:bg-main-background/10 [&:active>div]:bg-main-background/20'
              )}
              htmlFor={item}
            >
              <div className='hover-animation flex h-10 w-10 items-center justify-center rounded-full'>
                <input
                  className='peer absolute h-0 w-0 opacity-0'
                  id={item}
                  type='radio'
                  name='theme'
                  value={item}
                  checked={locale === item}
                  onClick={() => setLocale(item as LOCALES)}
                />
                <i
                  className={cn(
                    `flex h-5 w-5 items-center justify-center rounded-full 
                                border-2 border-[#B9CAD3] text-white transition
                                duration-200 peer-checked:border-transparent
                                peer-checked:bg-main-accent peer-checked:inner:opacity-100`,
                    'border-[#B9CAD3]'
                  )}
                >
                  <HeroIcon
                    className='h-full w-full p-0.5 opacity-0 transition-opacity duration-200'
                    iconName='CheckIcon'
                  />
                </i>
              </div>
              {i18n._(languages[item])}
            </label>
          ))}
        </div>
      </div>
      <Button
        className='bg-main-accent px-4 py-1.5 font-bold
                 text-white hover:bg-main-accent/90 active:bg-main-accent/75'
        onClick={handleChange}
      >
        <Trans>Done</Trans>
      </Button>
    </div>
  );
}
