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

import { useEffect, useState } from 'react';
import { Error } from '@components/ui/error';
import { GetStaticProps } from 'next';
import { loadCatalog } from 'translations/utils';
import { useLingui } from '@lingui/react';

export const getStaticProps: GetStaticProps = async (ctx) => {
  const translation = await loadCatalog(ctx.locale!)
  return {
    props: {
      translation
    }
  }
}
export default function Home(): JSX.Element {
  useLingui();
  const { isMobile } = useWindow();
  const [dataList, setDataList] = useState<TweetProps[]>([]);

  const { data, LoadMore, loading } = useInfiniteScroll();

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
        {loading ? (
          <Loading className='mt-5' />
        ) : !data ? (
          <Error message='Something went wrong' />
        ) : (
          <>
            <AnimatePresence mode='popLayout'>
              {data.map((tweet) => (
                <Tweet {...tweet} key={tweet.id} />
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
