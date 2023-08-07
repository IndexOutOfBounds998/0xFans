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
import { Error } from '@components/ui/error';
import type { ReactElement, ReactNode } from 'react';
import {
  PublicationSortCriteria,
  PublicationTypes
} from '@lens-protocol/react-web';
import { PublicationMainFocus } from '@lens-protocol/client';
import { useEffect } from 'react';
export default function Home(): JSX.Element {
  const { isMobile } = useWindow();

  const { data, loading, LoadMore } = useInfiniteScroll({
    cursor: JSON.stringify({
      timestamp: 1,
      offset: 0
    }),
    sortCriteria: PublicationSortCriteria.Latest,
    limit: 20,
    publicationTypes: [PublicationTypes.Post],
    metadata: {
      mainContentFocus: [
        PublicationMainFocus.Image,
        PublicationMainFocus.Video
      ],
      tags: {
        oneOf: []
      }
    },
    sources: ['lenster', 'lenstrip', 'lenstube', 'orb', 'buttrfly', 'lensplay']
  });

  return (
    <MainContainer>
      <SEO title='Home / Twitter' />
      <MainHeader
        useMobileSidebar
        title='Home'
        className='flex items-center justify-between'
      >
        <UpdateUsername />
      </MainHeader>
      {!isMobile && <Input />}
      <section className='mt-0.5 xs:mt-0'>
        {loading ? (
          <Loading className='mt-5' />
        ) : !data ? (
          <Error message='Something went wrong' />
        ) : (
          <>
            <AnimatePresence mode='popLayout'>
              {data.map((tweet, index) => (
                <Tweet {...tweet} key={index} />
              ))}
            </AnimatePresence>
            <LoadMore />
          </>
        )}
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
