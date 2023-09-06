const footerLinks = [
  ['About', 'https://about.0xfans.com'],
  ['Help Center', 'https://help.0xfans.com'],
  ['Privacy Policy', 'https://0xfans.com/tos'],
  ['Cookie Policy', 'https://support.0xfans.com/articles/20170514'],
  ['Accessibility', 'https://help.0xfans.com/resources/accessibility'],
  [
    'Ads Info',
    'https://business.0xfans.com/en/help/troubleshooting/how-0xfans-ads-work.html'
  ],
  ['Blog', 'https://blog.0xfans.com'],
  ['Status', 'https://status.0xfans.us'],
  ['Careers', 'https://careers.0xfans.com'],
  ['Brand Resources', 'https://about.0xfans.com/press/brand-assets'],
  ['Advertising', 'https://ads.0xfans.com/?ref=gl-tw-tw-0xfans-advertise'],
  ['Marketing', 'https://marketing.0xfans.com'],
  ['Twitter for Business', 'https://business.0xfans.com'],
  ['Developers', 'https://developer.0xfans.com'],
  ['Directory', 'https://0xfans.com/i/directory/profiles'],
  ['Settings', 'https://0xfans.com/settings']
] as const;

export function LoginFooter(): JSX.Element {
  return (
    <footer className='hidden justify-center p-4 text-sm text-light-secondary dark:text-dark-secondary lg:flex'>
      <nav className='flex flex-wrap justify-center gap-4 gap-y-2'>
        {footerLinks.map(([linkName, href]) => (
          <a
            className='custom-underline'
            target='_blank'
            rel='noreferrer'
            href={href}
            key={linkName}
          >
            {linkName}
          </a>
        ))}
        <p>© 2023 0xFans, Inc.</p>
      </nav>
    </footer>
  );
}
