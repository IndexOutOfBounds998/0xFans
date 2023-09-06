import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@lib/context/auth-context';
import { User } from '@lib/types/user';

export function useRequireAuth(redirectUrl?: string): User | null {
  const { user, loading } = useAuth();
  const { replace } = useRouter();

  useEffect(() => {
    console.log('redirectUrl' + redirectUrl);
    if (!loading && !user) void replace(redirectUrl ?? '/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  return user;
}
