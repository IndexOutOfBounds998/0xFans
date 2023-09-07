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
import { Tweet, TweetProps } from '@components/tweet/tweet';
import { Loading } from '@components/ui/loading';
import type { ReactElement, ReactNode } from 'react';
import PubSub from 'pubsub-js';
import {
  PublicationSortCriteria,
  PublicationTypes
} from '@lens-protocol/react-web';
import { PublicationMainFocus } from '@lens-protocol/client';
import { APP_ID } from '@lib/const';
import { useEffect, useState } from 'react';
export default function Home(): JSX.Element {
  const { isMobile } = useWindow();
  const [dataList, setDataList] = useState<TweetProps[]>([]);

  const { data, LoadMore, loading } = useInfiniteScroll({
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
        PublicationMainFocus.Video,
        PublicationMainFocus.TextOnly
      ],
      tags: {
        oneOf: []
      }
    },
    sources: [APP_ID]
  });

  useEffect(() => {
    if (data) {
      setDataList(data);
    }
  }, [data]);

  useEffect(() => {
    const token = PubSub.subscribe('delPost', (msg, tweetId) => {
      const list = JSON.parse(JSON.stringify(dataList));
      const todolist = list.filter((item: any) => item.id !== tweetId);
      setDataList(todolist);
    });
    return () => {
      PubSub.unsubscribe(token);
    };
  }, [dataList]);

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
          !dataList ? (
            <Loading className='mt-5' />
          ) : (
            // <Error message='Something went wrong' />
            <>
              <AnimatePresence mode='popLayout'>
                {dataList.map((tweet, index) => (
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
