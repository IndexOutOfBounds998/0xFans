import { AnimatePresence } from 'framer-motion';
import { useUser } from '@lib/context/user-context';

import { UserLayout, ProtectedLayout } from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import { UserDataLayout } from '@components/layout/user-data-layout';
import { UserHomeLayout } from '@components/layout/user-home-layout';
import { StatsEmpty } from '@components/publication/stats-empty';
import { Loading } from '@components/ui/loading';
import { Publication } from '@components/publication/publication';
import type { ReactElement, ReactNode } from 'react';

import { PublicationMainFocus, profileId } from '@lens-protocol/react-web';
import { useInfinitePublicationsScroll } from '@lib/hooks/useInfinitePublicationsScroll';

export default function UserTweets(): JSX.Element {
  const { user } = useUser();

  const { id, username } = user ?? {};

  const { data, loading, LoadMore } = useInfinitePublicationsScroll({
    profileId: profileId((id as string) ?? ''),
    limit: 20,
    metadataFilter: {
      restrictPublicationMainFocusTo: [
        PublicationMainFocus.TextOnly,
        PublicationMainFocus.Image,
        PublicationMainFocus.Video
      ]
    }
  });

  return (
    <section>
      {loading ? (
        <Loading className='mt-5' />
      ) : !data ? (
        <StatsEmpty
          title={`@${username as string} hasn't tweeted`}
          description='When they do, their Posts will show up here.'
        />
      ) : (
        <AnimatePresence mode='popLayout'>
          {/* {pinnedData && (
            <Tweet pinned {...pinnedData} key={`pinned-${pinnedData.id}`} />
          )} */}
          {data.map((publication) => (
            <Publication {...publication} profile={publication.profile} key={publication.id} />
          ))}
          <LoadMore />
        </AnimatePresence>
      )}
    </section>
  );
}

UserTweets.getLayout = (page: ReactElement): ReactNode => (
  <ProtectedLayout>
    <MainLayout>
      <UserLayout>
        <UserDataLayout>
          <UserHomeLayout>{page}</UserHomeLayout>
        </UserDataLayout>
      </UserLayout>
    </MainLayout>
  </ProtectedLayout>
);
