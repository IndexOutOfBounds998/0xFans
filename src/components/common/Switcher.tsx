import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { t, msg } from '@lingui/macro';
import type { MessageDescriptor } from '@lingui/core';
import { useLingui } from '@lingui/react';
import { ReactSelect } from '@components/ui/react-select';

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
    id: item,
    name: i18n._(languages[item])
  }));

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
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
    <ReactSelect
      value={
        selectList.filter((item) => item.id === locale)[0] || selectList[0]
      }
      className='w-full'
      list={selectList}
      onChange={handleChange}
    />
    // <select value={locale} onChange={handleChange}>
    //     {Object.keys(languages).map((locale) => {
    //         return (
    //             <option value={locale} key={locale}>
    //                 {i18n._(languages[locale as unknown as LOCALES])}
    //             </option>
    //         )
    //     })}
    // </select>
  );
}
