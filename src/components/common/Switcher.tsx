import { useRouter } from 'next/router'
import { useState } from 'react'
import { t, msg } from '@lingui/macro'
import type { MessageDescriptor } from "@lingui/core"
import { useLingui } from '@lingui/react'

type LOCALES = 'en-us' | 'zh-CN'

const languages: { [key: string]: MessageDescriptor } = {
    'en-us': msg`English`,
    'zh-CN': msg`Chinese`
}

export function Switcher() {
    const router = useRouter()

    const {
        query: { id },
        back
    } = useRouter();

    const { i18n } = useLingui()

    const [locale, setLocale] = useState<LOCALES>(
        router.locale as LOCALES
    )

    function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const locale = event.target.value as LOCALES

        setLocale(locale)
       
        if (id) {
            let path = router.pathname.replace('[id]', id)
            router.push(router.pathname, path, { locale })
        } else {
            router.push(router.pathname, router.pathname, { locale })
        }

    }

    return (
        <select value={locale} onChange={handleChange}>
            {Object.keys(languages).map((locale) => {
                return (
                    <option value={locale} key={locale}>
                        {i18n._(languages[locale as unknown as LOCALES])}
                    </option>
                )
            })}
        </select>
    )
}