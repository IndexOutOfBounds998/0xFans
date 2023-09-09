import { UserLayout, ProtectedLayout } from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import { UserDataLayout } from '@components/layout/user-data-layout';
import { UserFollowLayout } from '@components/layout/user-follow-layout';
import { UserFollowings } from '@components/user/user-followings';
import { useRouter } from 'next/router';
import type { ReactElement, ReactNode } from 'react';

export default function UserFollowing(): JSX.Element {
  const {
    query: { id }
  } = useRouter();
  return <UserFollowings type='following' id={id} />;
}

UserFollowing.getLayout = (page: ReactElement): ReactNode => (
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
