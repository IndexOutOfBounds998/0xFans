import Link from 'next/link';
import { motion } from 'framer-motion';

import { useAuth } from '@lib/context/auth-context';
import { useCollection } from '@lib/hooks/useCollection';

import { UserCard } from '@components/user/user-card';
import { Loading } from '@components/ui/loading';
import { Error } from '@components/ui/error';
import { variants } from './aside-trends';
import { User } from '@lib/types/user';
import { ProfileSortCriteria } from '@lens-protocol/react-web';

export function Suggestions(): JSX.Element {

  const { user: profileUser } = useAuth();
  const { data: suggestionsData, loading: suggestionsLoading, user } = useCollection({ observerId: profileUser?.id, limit: 5, sortCriteria: ProfileSortCriteria.MostFollowers });

  return (
    <section className='hover-animation rounded-2xl bg-main-sidebar-background'>
      {suggestionsLoading ? (
        <Loading className='flex h-52 items-center justify-center p-4' />
      ) : suggestionsData ? (
        <motion.div className='inner:px-4 inner:py-3' {...variants}>
          <h2 className='text-xl font-bold'>Who to follow</h2>

          {user?.map((userData: User) => (
            <UserCard {...userData} key={userData.id} />
          ))}
          <Link href='/people'>
          <span
            className='custom-button accent-tab hover-card block w-full rounded-2xl
                         rounded-t-none text-center text-main-accent'
          >
            Show more
          </span>
          </Link>
        </motion.div>
      ) : (
        <Error />
      )}
    </section>
  );
}
