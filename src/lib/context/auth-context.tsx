import { useState, useEffect, useContext, createContext, useMemo } from 'react';
import type { ReactNode } from 'react';

import {
  useWalletLogin,
  useActiveProfile,
  useWalletLogout,
  MediaSet,
  Profile,
  ProfileOwnedByMe
} from '@lens-protocol/react-web';
import { getWalletClient } from '@wagmi/core';
import { formatAvater, formatNickName, getProfileAttribute } from '@lib/FormatContent';

import type { User } from '@lib/types/user';
type UserProps = Pick<
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
  user: UserCardProps | null;
  profileByMe: ProfileOwnedByMe | undefined;
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

type UserCardProps = UserProps & {
  modal?: boolean;
  follow?: boolean;
};

export function AuthContextProvider({
  children
}: AuthContextProviderProps): JSX.Element {
  const [user, setUser] = useState<UserCardProps | null>(null);
  const [profileByMe, setProfile] = useState<ProfileOwnedByMe>();
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
    if (profile) {
      setProfile(profile);
    }
  }, [profile]);

  useEffect(() => {

    const manageUser = async (): Promise<void> => {
      if (profile) {

        let userObj: UserCardProps = {
          id: profile.id,
          bio: profile.bio,
          name: formatNickName(profile.handle),
          username: profile?.name || formatNickName(profile.handle),
          photoURL: formatAvater((profile?.picture as MediaSet)?.original?.url),
          verified: true,
          following: profile.stats.totalFollowing,
          followers: profile.stats.totalFollowers,
          totalTweets: profile?.stats?.totalPosts,
          coverPhotoURL: formatAvater(
            (profile?.coverPicture as MediaSet)?.original.url
          ),
          updatedAt: null,
          totalPhotos: 0,
          pinnedTweet: null,
          theme: null,
          accent: null,
          website: getProfileAttribute(profile?.__attributes, 'website'),
          location: getProfileAttribute(profile?.__attributes, 'location'),
          createdAt: null,
          follow:profile.isFollowedByMe
        };
        setUser(userObj);
      }
      setLoading(profileLoading);
      setError(profileError!);
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
    if (loginError) {
      setError(loginError);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      logout();
      setUser(null);
    } catch (error) {
      setError(error as Error);
    }
  };

  const isAdmin = false;

  const value: AuthContext = {
    user,
    profileByMe,
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
