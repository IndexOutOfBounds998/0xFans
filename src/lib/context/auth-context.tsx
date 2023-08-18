import { useState, useEffect, useContext, createContext, useMemo } from 'react';
import type { ReactNode } from 'react';

import {
  useWalletLogin,
  useActiveProfile,
  useWalletLogout,
  MediaSet
} from '@lens-protocol/react-web';
import { getWalletClient } from '@wagmi/core';
import { formatAvater, formatNickName } from '@lib/FormatContent';

import type { User } from '@lib/types/user';
type UserDetailsProps = Pick<
  User,
  | 'id'
  | 'bio'
  | 'name'
  | 'username'
  | 'photoURL'
  | 'totalTweets'
  | 'coverPhotoURL'
  | 'verified'
  | 'following'
  | 'followers'
  | 'theme'
  | 'location'
  | 'updatedAt'
  | 'totalPhotos'
  | 'pinnedTweet'
  | 'accent'
  | 'website'
  | 'createdAt'
>;
type AuthContext = {
  user: UserDetailsProps | null;
  error: Error | null;
  loading: boolean;
  isAdmin: boolean;
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
  const [user, setUser] = useState<UserDetailsProps | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    data: profile,
    error: profileError,
    loading: profileLoading
  } = useActiveProfile();

  const {
    execute: login,
    error: loginError,
    isPending: isLoginPending
  } = useWalletLogin();

  const { execute: logout, isPending } = useWalletLogout();

  useEffect(() => {
    const manageUser = async (): Promise<void> => {
      setLoading(true);
      if (profile) {
        let userObj: UserDetailsProps = {
          id: profile.id,
          bio: profile.bio,
          name: formatNickName(profile.handle),
          username: profile?.name || 'null',
          photoURL: formatAvater((profile?.picture as MediaSet)?.original?.url),
          verified: true,
          following: [],
          followers: [],
          totalTweets: profile?.stats?.totalPosts,
          coverPhotoURL: (profile?.coverPicture as MediaSet)?.original.url,
          location: null,
          updatedAt: null,
          totalPhotos: 0,
          pinnedTweet: null,
          theme: null,
          accent: null,
          website: null,
          createdAt: null
        };
        setUser(userObj);
      }
      setLoading(profileLoading);
      setError(profileError!);
      setLoading(false);
    };
    manageUser();
  }, [profile, profileLoading, profileError]);

  const signInWithLens = async (): Promise<void> => {
    try {
      setLoading(true);
      const walletClient = await getWalletClient();
      if (walletClient) {
        await login({
          address: walletClient.account.address
        });
      }
    } catch (error) {
      setError(error as Error);
    }
    setLoading(false);
  };

  const signOut = async (): Promise<void> => {
    try {
      logout();
    } catch (error) {
      setError(error as Error);
    }
  };

  const isAdmin = false;

  const value: AuthContext = {
    user,
    error,
    loading,
    isAdmin,
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
