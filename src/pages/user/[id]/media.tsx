import { AnimatePresence } from 'framer-motion';
import { useUser } from '@lib/context/user-context';
import { UserLayout, ProtectedLayout } from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import { SEO } from '@components/common/seo';
import { UserDataLayout } from '@components/layout/user-data-layout';
import { UserHomeLayout } from '@components/layout/user-home-layout';
import { Publication } from '@components/publication/publication';
import { Loading } from '@components/ui/loading';
import { StatsEmpty } from '@components/publication/stats-empty';
import type { ReactElement, ReactNode } from 'react';
import { useInfinitePublicationsScroll } from '@lib/hooks/useInfinitePublicationsScroll';
import { PublicationMainFocus, profileId } from '@lens-protocol/react-web';

export default function UserMedia(): JSX.Element {
  const { user } = useUser();

  const { id, name, username } = user ?? {};

  const { data, loading, LoadMore } = useInfinitePublicationsScroll({
    profileId: profileId((id as string) ?? ''),
    limit: 10,
    metadataFilter: {
      restrictPublicationMainFocusTo: [
        PublicationMainFocus.Image,
        PublicationMainFocus.Video
      ]
    }
  });

  return (
    <section>
      <SEO
        title={`Media 0xFans by ${name as string} (@${
          username as string
        }) / 0xFans`}
      />
      {loading ? (
        <Loading className='mt-5' />
      ) : !data ? (
        <StatsEmpty
          title={`@${username as string} hasn't Tweeted Media`}
          description='Once they do, those Posts will show up here.'
          imageData={{ src: '/assets/no-media.png', alt: 'No media' }}
        />
      ) : (
        <AnimatePresence mode='popLayout'>
          {data.map((publication) => (
            <Publication {...publication} key={publication.id} />
          ))}
          <LoadMore />
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
