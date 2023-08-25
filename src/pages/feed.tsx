import { AnimatePresence } from 'framer-motion';

import { useWindow } from '@lib/context/window-context';
import { useInfiniteScroll } from '@lib/hooks/useInfiniteScroll';

import { HomeLayout, ProtectedLayout } from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import { SEO } from '@components/common/seo';
import { MainContainer } from '@components/home/main-container';
import { Input } from '@components/input/input';
import { UpdateUsername } from '@components/home/update-username';
import { MainHeader } from '@components/home/main-header';
import { Tweet } from '@components/tweet/tweet';
import { Loading } from '@components/ui/loading';
import type { ReactElement, ReactNode } from 'react';
import {
  ProfileId
} from '@lens-protocol/react-web';
import { useFeedInfiniteScroll } from '@lib/hooks/useFeedInfiniteScroll';
import { useAuth } from '@lib/context/auth-context';
export default function Home(): JSX.Element {
  const {user} =useAuth();
  const { isMobile } = useWindow();

  const { data, LoadMore } = useFeedInfiniteScroll(user?.id as ProfileId);

  return (
    <MainContainer>
      <SEO title='Home / 0xFans' />
      <MainHeader
        useMobileSidebar
        title='Home'
        className='flex items-center justify-between'
      >
        <UpdateUsername />
      </MainHeader>
      {!isMobile && <Input />}
      <section className='mt-0.5 xs:mt-0'>
        {
          //   loading ? (
          //   <Loading className='mt-5' />
          // ) :
          !data ? (
            <Loading className='mt-5' />
          ) : (
            // <Error message='Something went wrong' />
            <>
              <AnimatePresence mode='popLayout'>
                {data.map((tweet, index) => (
                  <Tweet {...tweet} key={index} />
                ))}
              </AnimatePresence>
              <LoadMore />
            </>
          )
        }
      </section>
    </MainContainer>
  );
}

Home.getLayout = (page: ReactElement): ReactNode => (
  <ProtectedLayout>
    <MainLayout>
      <HomeLayout>{page}</HomeLayout>
    </MainLayout>
  </ProtectedLayout>
);
