import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@lib/context/auth-context';
import { ProfileOwnedByMe } from '@lens-protocol/react-web';

export function useRequireAuth(redirectUrl?: string): ProfileOwnedByMe | null {
  const { user, loading } = useAuth();
  const { replace } = useRouter();

  useEffect(() => {
    console.log('redirectUrl' + redirectUrl)
    if (!loading && !user) void replace(redirectUrl ?? '/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  return user;
}
