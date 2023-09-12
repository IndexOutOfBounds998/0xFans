import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@lib/context/auth-context';
import { UserCardProps, useCollection } from '@lib/hooks/useCollection';
import { UserCard } from '@components/user/user-card';
import { Loading } from '@components/ui/loading';
import { Error } from '@components/ui/error';
import { variants } from './aside-trends';
import { ProfileSortCriteria, profileId } from '@lens-protocol/react-web';
import { Trans } from '@lingui/macro';
export function Suggestions(): JSX.Element {
  const { user: profileUser } = useAuth();
  const { data: suggestionsData, loading: suggestionsLoading } =
    useCollection<UserCardProps>({
      observerId: profileId(profileUser?.id?.toString() ?? ''),
      limit: 3,
      sortCriteria: ProfileSortCriteria.MostFollowers
    });

  return (
    <section className='hover-animation rounded-2xl bg-main-sidebar-background'>
      {suggestionsLoading ? (
        <Loading className='flex h-52 items-center justify-center p-4' />
      ) : suggestionsData ? (
        <motion.div className='inner:px-4 inner:py-3' {...variants}>
          <h2 className='text-xl font-bold'>
            <Trans>Who to follow</Trans>
          </h2>

          {suggestionsData?.map((userData: UserCardProps) => (
            <UserCard
              {...userData}
              key={userData.id.toString()}
              follow={userData.follow}
              profile={userData.profile}
            />
          ))}
          <Link href='/people'>
            <span
              className='custom-button accent-tab hover-card block w-full rounded-2xl
                         rounded-t-none text-center text-main-accent'
            >
              <Trans>Show more</Trans>
            </span>
          </Link>
        </motion.div>
      ) : (
        <Error />
      )}
    </section>
  );
}
