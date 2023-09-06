const footerLinks = [
  ['Terms of Service', 'https://0xFans.com/tos'],
  ['Privacy Policy', 'https://0xFans.com/privacy'],
  ['Cookie Policy', 'https://support.0xFans.com/articles/20170514'],
  ['Accessibility', 'https://help.0xFans.com/resources/accessibility'],
  [
    'Ads Info',
    'https://business.0xFans.com/en/help/troubleshooting/how-0xFans-ads-work.html'
  ]
] as const;

export function AsideFooter(): JSX.Element {
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
      <p>© 2023 0xFans, Inc.</p>
    </footer>
  );
}
