import { useRouter } from 'next/router';

import { UserContextProvider } from '@lib/context/user-context';
import { SEO } from '@components/common/seo';
import { MainContainer } from '@components/home/main-container';
import { MainHeader } from '@components/home/main-header';
import { UserHeader } from '@components/user/user-header';
import type { LayoutProps } from './common-layout';
import { useProfileContext } from '@lib/hooks/useProfile';
export function UserDataLayout({ children }: LayoutProps): JSX.Element {
  const {
    query: { id },
    back
  } = useRouter();

  const { data: profile, loading } = useProfileContext({ profileId: id });
  console.log(profile);

  return (
    <UserContextProvider value={{ profile, loading }}>
      {!profile && !loading && <SEO title='User not found / Twitter' />}
      <MainContainer>
        <MainHeader useActionButton action={back}>
          <UserHeader />
        </MainHeader>
        {children}
      </MainContainer>
    </UserContextProvider>
  );
}
