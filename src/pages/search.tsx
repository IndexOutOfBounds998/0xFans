import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useAuth } from '@lib/context/auth-context';
import { useInfiniteUserScroll } from '@lib/hooks/useInfiniteUserScroll';
import {
  PeopleLayout,
  ProtectedLayout
} from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import { SEO } from '@components/common/seo';
import { MainHeader } from '@components/home/main-header';
import { MainContainer } from '@components/home/main-container';
import { UserCard } from '@components/user/user-card';
import { Loading } from '@components/ui/loading';
import { Error } from '@components/ui/error';
import { variants } from '@components/aside/aside-trends';
import type { ReactElement, ReactNode } from 'react';
import { profileId } from '@lens-protocol/react-web';
import { useInfiniteSearchUserScroll } from '@lib/hooks/useInfiniteSearchUserScroll';

export default function People(): JSX.Element {
  const { user } = useAuth();

  const {
    query: { q },
    back
  } = useRouter();

  const { data, loading, LoadMore } = useInfiniteSearchUserScroll({
    observerId: profileId(user?.id.toString() ?? ''),
    limit: 20,
    query: q
  });

  return (
    <MainContainer>
      <SEO title='People / 0xFans' />
      <MainHeader useActionButton title='Search' action={back} />
      <section>
        {loading ? (
          <Loading className='mt-5' />
        ) : !data ? (
          <Error message='Something went wrong' />
        ) : (
          <>
            <motion.div className='mt-0.5' {...variants}>
              {data?.map((userData) => (
                <UserCard {...userData} key={userData.id.toString()} follow={userData.follow} profile={userData.profile} />
              ))}
            </motion.div>
            <LoadMore />
          </>
        )}
      </section>
    </MainContainer>
  );
}

People.getLayout = (page: ReactElement): ReactNode => (
  <ProtectedLayout>
    <MainLayout>
      <PeopleLayout>{page}</PeopleLayout>
    </MainLayout>
  </ProtectedLayout>
);
