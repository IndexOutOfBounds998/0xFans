 
import { AnimatePresence } from 'framer-motion';
import { useUser } from '@lib/context/user-context';
 
import { UserLayout, ProtectedLayout } from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import { UserDataLayout } from '@components/layout/user-data-layout';
import { UserHomeLayout } from '@components/layout/user-home-layout';
import { StatsEmpty } from '@components/tweet/stats-empty';
import { Loading } from '@components/ui/loading';
import { Tweet, TweetProps } from '@components/tweet/tweet';
import type { ReactElement, ReactNode } from 'react';
 
export default function UserTweets(): JSX.Element {
  const { user } = useUser();

  const { id, username } = user ?? {};

  // const { data: pinnedData } = useDocument(
  //   doc(tweetsCollection, pinnedTweet ?? 'null'),
  //   {
  //     disabled: !pinnedTweet,
  //     allowNull: true,
  //     includeUser: true
  //   }
  // );
  const pinnedData: TweetProps[] = [];
  const ownerLoading = false;
  const peopleLoading = false;
  // const { data: ownerTweets, loading: ownerLoading } = useCollection();

  // const { data: peopleTweets, loading: peopleLoading } = useCollection();

  const mergedTweets:TweetProps[] = []

  return (
    <section>
      {ownerLoading || peopleLoading ? (
        <Loading className='mt-5' />
      ) : !mergedTweets ? (
        <StatsEmpty
          title={`@${username as string} hasn't tweeted`}
          description='When they do, their Tweets will show up here.'
        />
      ) : (
        <AnimatePresence mode='popLayout'>
          {/* {pinnedData && (
            <Tweet pinned {...pinnedData} key={`pinned-${pinnedData.id}`} />
          )}
          {mergedTweets.map((tweet) => (
            <Tweet {...tweet} profile={user} key={tweet.id} />
          ))} */}
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
