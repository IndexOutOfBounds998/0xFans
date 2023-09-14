import { useRouter } from 'next/router';
import React, { Fragment, useState } from 'react';
import { t, msg } from '@lingui/macro';
import type { MessageDescriptor } from '@lingui/core';
import { useLingui } from '@lingui/react';
import { ReactSelect } from '@components/ui/react-select';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline';
import { HeroIcon } from '@components/ui/hero-icon';

type LOCALES = 'en-us' | 'zh-CN';

const languages: { [key: string]: MessageDescriptor } = {
  'en-us': msg`English`,
  'zh-CN': msg`Chinese`
};

export function Switcher() {
  const router = useRouter();

  const {
    query: { id },
    back
  } = useRouter();

  const { i18n } = useLingui();

  const [locale, setLocale] = useState<LOCALES>(router.locale as LOCALES);

  const selectList = Object.keys(languages).map((item) => ({
    id: item as LOCALES,
    name: i18n._(languages[item])
  }));
  const value =
    selectList.filter((item) => item.id === locale)[0] || selectList[0];

  function handleChange(event: any) {
    const locale = event.id as LOCALES;

    setLocale(locale);

    if (id) {
      let path = router.pathname.replace('[id]', id);
      router.push(router.pathname, path, { locale });
    } else {
      router.push(router.pathname, router.pathname, { locale });
    }
  }

  return (
    <Listbox value={value} onChange={handleChange}>
      <div className='relative'>
        <Listbox.Button className='relative cursor-pointer cursor-default rounded-lg bg-white p-2 text-left focus:outline-none sm:text-sm'>
          <div className='flex justify-start'>
            <HeroIcon className='h-5 w-5' iconName='GlobeAltIcon' />
            &nbsp;
            <span className='block truncate'>{value.name}</span>
          </div>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave='transition ease-in duration-100'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <Listbox.Options className='absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
            {selectList.map((item, personIdx) => (
              <Listbox.Option
                key={personIdx}
                className={({ active }) =>
                  `relative cursor-default select-none p-2 ${
                    active
                      ? 'bg-main-accent/10 text-main-accent/90'
                      : 'text-gray-900'
                  }`
                }
                value={item}
              >
                {({ selected }) => (
                  <span
                    className={`block truncate ${
                      selected ? 'font-medium' : 'font-normal'
                    }`}
                  >
                    {item.name}
                  </span>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
