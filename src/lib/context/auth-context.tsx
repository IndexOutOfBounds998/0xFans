import { useState, useEffect, useContext, createContext, useMemo } from 'react';
import { getRandomId, getRandomInt } from '@lib/random';
import type { ReactNode } from 'react';
import type { Bookmark } from '@lib/types/bookmark';
import { useWalletLogin, useActiveProfile, useWalletLogout, ProfileOwnedByMe } from "@lens-protocol/react-web";
import { getWalletClient } from "@wagmi/core";

type AuthContext = {
  user: ProfileOwnedByMe | null;
  error: Error | null;
  loading: boolean;
  userBookmarks: Bookmark[] | null;
  signOut: () => Promise<void>;
  signInWithLens: () => Promise<void>;
};

export const AuthContext = createContext<AuthContext | null>(null);

type AuthContextProviderProps = {
  children: ReactNode;
};

export function AuthContextProvider({
  children
}: AuthContextProviderProps): JSX.Element {

  const [user, setUser] = useState<ProfileOwnedByMe | null>(null);
  const [userBookmarks, setUserBookmarks] = useState<Bookmark[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  

  const { data: profile, error: profileError, loading: profileLoading } = useActiveProfile();

  const {
    execute: login,
    error: loginError,
    isPending: isLoginPending,
  } = useWalletLogin();

  const { execute: logout, isPending } = useWalletLogout();

  useEffect(() => {
    const manageUser = async (): Promise<void> => {
      setUser(profile!);
      setLoading(profileLoading);
      setError(profileError!);
    };
    manageUser()
  }, []);
 

  const signInWithLens = async (): Promise<void> => {
    try {
      const walletClient = await getWalletClient();
      if (walletClient) {
        await login({
          address: walletClient.account.address,
        });
      }
    } catch (error) {
      setError(error as Error);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      logout();
    } catch (error) {
      setError(error as Error);
    }
  };


  const randomSeed = useMemo(getRandomId, [user?.id]);

  const value: AuthContext = {
    user,
    error,
    loading,
    randomSeed,
    userBookmarks,
    signOut,
    signInWithLens
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContext {
  const context = useContext(AuthContext);

  if (!context)
    throw new Error('useAuth must be used within an AuthContextProvider');

  return context;
}
