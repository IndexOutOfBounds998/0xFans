import { AnimatePresence } from 'framer-motion';

import { useCollection } from '@lib/hooks/useCollection';

import { useUser } from '@lib/context/user-context';
import { UserLayout, ProtectedLayout } from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import { SEO } from '@components/common/seo';
import { UserDataLayout } from '@components/layout/user-data-layout';
import { UserHomeLayout } from '@components/layout/user-home-layout';
import { Publication } from '@components/publication/publication';
import { Loading } from '@components/ui/loading';
import { StatsEmpty } from '@components/publication/stats-empty';
import { PublicationWithParent } from '@components/publication/publication-with-parent';
import type { ReactElement, ReactNode } from 'react';

export default function UserWithReplies(): JSX.Element {
  const { user } = useUser();

  const { id, name, username } = user ?? {};

  // const { data: pinnedData } = useDocument(
  //   doc(tweetsCollection, pinnedTweet ?? 'null'),
  //   {
  //     disabled: !pinnedTweet,
  //     allowNull: true,
  //     includeUser: true
  //   }
  // );

  const { data, loading } = useCollection();

  return (
    <section>
      <SEO
        title={`Posts with replies by ${name as string} (@${
          username as string
        }) / Twitter`}
      />
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
          )}
          <TweetWithParent data={data} /> */}
        </AnimatePresence>
      )}
    </section>
  );
}

UserWithReplies.getLayout = (page: ReactElement): ReactNode => (
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
