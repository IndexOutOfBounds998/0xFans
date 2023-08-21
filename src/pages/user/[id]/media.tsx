import { AnimatePresence } from 'framer-motion';
import { useUser } from '@lib/context/user-context';
import { UserLayout, ProtectedLayout } from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import { SEO } from '@components/common/seo';
import { UserDataLayout } from '@components/layout/user-data-layout';
import { UserHomeLayout } from '@components/layout/user-home-layout';
import { Tweet } from '@components/tweet/tweet';
import { Loading } from '@components/ui/loading';
import { StatsEmpty } from '@components/tweet/stats-empty';
import type { ReactElement, ReactNode } from 'react';
import { Tweet as Tw } from '@lib/types/tweet';

export default function UserMedia(): JSX.Element {
  const { user } = useUser();

  const { id, name, username } = user ?? {};

  // const { data, loading } = useCollection();

  // const sortedTweets = mergeData(true, data);

  const loading = false;
  const sortedTweets: Tw[] = [];
  return (
    <section>
      <SEO
        title={`Media Tweets by ${name as string} (@${
          username as string
        }) / Twitter`}
      />
      {loading ? (
        <Loading className='mt-5' />
      ) : !sortedTweets ? (
        <StatsEmpty
          title={`@${username as string} hasn't Tweeted Media`}
          description='Once they do, those Tweets will show up here.'
          imageData={{ src: '/assets/no-media.png', alt: 'No media' }}
        />
      ) : (
        <AnimatePresence mode='popLayout'>
          {sortedTweets.map((tweet) => (
            <Tweet {...tweet} key={tweet.id} />
          ))}
        </AnimatePresence>
      )}
    </section>
  );
}

UserMedia.getLayout = (page: ReactElement): ReactNode => (
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
