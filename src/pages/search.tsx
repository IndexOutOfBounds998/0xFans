import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useAuth } from '@lib/context/auth-context';
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
export default function People(): JSX.Element {
  useLingui();

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
                <UserCard {...userData} />
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
