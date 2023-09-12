import { motion } from 'framer-motion';
import cn from 'clsx';
import { variants } from '@components/user/user-header';
import { UserNavLink } from './user-nav-link';
import { Trans, t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

type UserNavProps = {
  follow?: boolean;
};

const allNavs = [
  [
    { name: t`Posts`, path: '' },
    // { name: 'Tweets & replies', path: 'with_replies' },
    { name: t`Media`, path: 'media' }
    // { name: 'Likes', path: 'likes' }
  ],
  [
    { name: t`Following`, path: 'following' },
    { name: t`Followers`, path: 'followers' }
  ]
] as const;

export function UserNav({ follow }: UserNavProps): JSX.Element {
  useLingui();
  const userNav = allNavs[+!!follow];

  return (
    <motion.nav
      className={cn(
        `hover-animation flex justify-between overflow-y-auto
         border-b border-light-border dark:border-dark-border`,
        follow && 'mt-1 mb-0.5'
      )}
      {...variants}
      exit={undefined}
    >
      {userNav.map(({ name, path }) => (
        <UserNavLink name={name} path={path} key={name} />
      ))}
    </motion.nav>
  );
}
