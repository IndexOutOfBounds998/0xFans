import { AnimatePresence } from 'framer-motion';

import { useWindow } from '@lib/context/window-context';
import { HomeLayout, ProtectedLayout } from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import { SEO } from '@components/common/seo';
import { MainContainer } from '@components/home/main-container';
import { Input } from '@components/input/input';
import { Publication } from '@components/publication/publication';
import { Loading } from '@components/ui/loading';
import type { ReactElement, ReactNode } from 'react';
import { ProfileId } from '@lens-protocol/react-web';
import { useFeedInfiniteScroll } from '@lib/hooks/useFeedInfiniteScroll';
import { useAuth } from '@lib/context/auth-context';
import { Error } from '@components/ui/error';
import { MainHeader } from '@components/home/main-header';

import { GetStaticProps } from 'next';
import { loadCatalog } from 'translations/utils';
import { useLingui } from '@lingui/react';
export const getStaticProps: GetStaticProps = async (ctx) => {
  const translation = await loadCatalog(ctx.locale!)

  return {
    props: {
      translation,
      i18n: translation
    }
  }
}
export default function Home(): JSX.Element {
  useLingui();
  const { user } = useAuth();
  const { isMobile } = useWindow();

  const { data, LoadMore, loading } = useFeedInfiniteScroll(
    user?.id as ProfileId
  );

  return (
    <MainContainer>
      <SEO title='Home / 0xFans' />
      <MainHeader
        useMobileSidebar
        title='Feed'
        className='flex items-center justify-between'
      ></MainHeader>
      {!isMobile && <Input />}
      <section className='mt-0.5 xs:mt-0'>
        {loading ? (
          <Loading className='mt-5' />
        ) : !data ? (
          <Error message='Something went wrong' />
        ) : (
          <>
            <AnimatePresence mode='popLayout'>
              {data.map((publication, index) => (
                <Publication {...publication} key={index} />
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
