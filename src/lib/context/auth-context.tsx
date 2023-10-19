import { useState, useEffect, useContext, createContext, useMemo } from 'react';
import type { ReactNode } from 'react';

import {
  useWalletLogin,
  useActiveProfile,
  useWalletLogout,
  MediaSet,
  Profile,
  ProfileOwnedByMe,
  useCreateProfile
} from '@lens-protocol/react-web';
import { getWalletClient } from '@wagmi/core';
import {
  formatAvater,
  formatNickName,
  getProfileAttribute
} from '@lib/FormatContent';

import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import { MAIN_NETWORK } from '@lib/const';
import { polygon, polygonMumbai } from 'wagmi/chains';

import type { User } from '@lib/types/user';
import { Accent, Theme } from '@lib/types/theme';
import { useRouter } from 'next/router';
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
  isLoginAction: boolean;
  loginAddress: string;
  signOut: () => Promise<void>;
  signInWithLens: () => Promise<void>;
  createProfile: (handle: string) => Promise<void>;
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

  //注册
  const { execute: create, error: createError } = useCreateProfile();

  useEffect(() => {
    if (profile) {
      setProfile(profile);
    }
  }, [profile]);

  const { chain } = useNetwork();

  const { address } = useAccount();
  const { push, pathname } = useRouter();
  const { switchNetwork } = useSwitchNetwork();
  let loginAddress = '';
  let isLoginAction = false;
  if (typeof window !== 'undefined') {
    loginAddress = localStorage.getItem('loginAddress') || '';
    isLoginAction = Boolean(
      JSON.parse(localStorage.getItem('isLoginAction') || 'false')
    );

    useEffect(() => {
      // Perform localStorage action
      loginAddress = localStorage.getItem('loginAddress') || '';
      isLoginAction = Boolean(
        JSON.parse(localStorage.getItem('isLoginAction') || 'false')
      );
    }, [
      localStorage.getItem('loginAddress'),
      localStorage.getItem('isLoginAction')
    ]);
  }

  useEffect(() => {
    if (isLoginAction) {
      if (address && loginAddress) {
        if (address.toLocaleLowerCase() !== loginAddress.toLocaleLowerCase()) {
          signOut();
        }
      }
    }
  }, [address, loginAddress]);

  useEffect(() => {
    if (chain && switchNetwork) {
      const targetNetworkId = MAIN_NETWORK ? polygon.id : polygonMumbai.id;
      if (chain.id !== targetNetworkId) {
        switchNetwork(targetNetworkId);
      }
    }
  }, [chain, switchNetwork]);

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
          theme: getProfileAttribute(profile?.__attributes, 'theme') as Theme,
          accent: getProfileAttribute(
            profile?.__attributes,
            'accent'
          ) as Accent,
          website: getProfileAttribute(profile?.__attributes, 'website'),
          location: getProfileAttribute(profile?.__attributes, 'location'),
          createdAt: null,
          follow: profile.isFollowedByMe
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
      debugger;
      if (walletClient) {
        const address = walletClient.account.address;
        await login({
          address: address
        });
        localStorage.setItem('loginAddress', address);
        localStorage.setItem('isLoginAction', 'true');
        setLoading(false);
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
      if (user && isLoginAction) {
        logout();
        setUser(null);
        localStorage.setItem('isLoginAction', 'false');
      }
    } catch (error) {
      setError(error as Error);
    }
  };

  const createProfile = async (handle: string): Promise<void> => {
    try {
      if (handle) {
        await create({ handle: handle });
        setLoading(true);
        debugger;
        setTimeout(() => {
          location.reload();
          // setLoading(false);
          // push('/home');
        }, 1000);
      }
    } catch (error) {
      setError(error as Error);
    }
  };

  const value: AuthContext = {
    user,
    profileByMe,
    error,
    loading,
    isLoginAction,
    loginAddress,
    signOut,
    signInWithLens,
    createProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContext {
  const context = useContext(AuthContext);

  if (!context)
    throw new Error('useAuth must be used within an AuthContextProvider');

  return context;
}
