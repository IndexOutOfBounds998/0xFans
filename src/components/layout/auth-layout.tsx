import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@lib/context/auth-context';
import { sleep } from '@lib/utils';
import { Placeholder } from '@components/common/placeholder';
import type { LayoutProps } from './common-layout';

export function AuthLayout({ children }: LayoutProps): JSX.Element {
  const [pending, setPending] = useState(true);

  const { user, loading, isLoginAction } = useAuth();

  const { replace } = useRouter();

  useEffect(() => {
    const checkLogin = async (): Promise<void> => {
      setPending(true);
      if (isLoginAction && user) {
        await sleep(500);
        void replace('/home');
      } else if (!loading) {
        await sleep(500);
        setPending(false);
      }

      if (isLoginAction && !user) {
        await sleep(500);
        void replace('/');
      }
    };

    void checkLogin();
  }, [user, loading, isLoginAction]);

  if (loading || pending) return <Placeholder />;

  return <>{children}</>;
}
