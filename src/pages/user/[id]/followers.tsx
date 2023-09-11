import { UserLayout, ProtectedLayout } from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import { UserDataLayout } from '@components/layout/user-data-layout';
import { UserFollowLayout } from '@components/layout/user-follow-layout';
import { UserFollower } from '@components/user/user-follower';
import { useRouter } from 'next/router';

import type { ReactElement, ReactNode } from 'react';

export default function UserFollowers(): JSX.Element {
  const {
    query: { id }
  } = useRouter();
  return <UserFollower type='followers' id={id} />;
}

UserFollowers.getLayout = (page: ReactElement): ReactNode => (
  <ProtectedLayout>
    <MainLayout>
      <UserLayout>
        <UserDataLayout>
          <UserFollowLayout>{page}</UserFollowLayout>
        </UserDataLayout>
      </UserLayout>
    </MainLayout>
  </ProtectedLayout>
);
