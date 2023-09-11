import { Switcher } from '@components/common/Switcher';
import { Trans, t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useState } from 'react';

export function AsideFooter(): JSX.Element {
  useLingui();

  const [footerLinks] = useState<string[][]>([
    [t`Terms of Service`, 'https://0xFans.com/tos'],
    [t`Privacy Policy`, 'https://0xFans.com/privacy'],
    [t`Cookie Policy`, 'https://support.0xFans.com/articles/20170514'],
    [t`Accessibility`, 'https://help.0xFans.com/resources/accessibility'],
    [t`Ads Info`, 'https://business.0xFans.com/en/help/troubleshooting/how-0xFans-ads-work.html']
  ])

  return (
    <footer
      className='sticky top-16 flex flex-col gap-3 text-center text-sm 
                 text-light-secondary dark:text-dark-secondary'
    >
      <nav className='flex flex-wrap justify-center gap-2'>
        {footerLinks.map(([linkName, href]) => (
          <a
            className='custom-underline'
            target='_blank'
            rel='noreferrer'
            href={href}
            key={href}
          >
            {linkName}
          </a>
        ))}
      </nav>
      <Switcher></Switcher>
      <p>© 2023 0xFans, Inc.</p>
    </footer>
  );
}
