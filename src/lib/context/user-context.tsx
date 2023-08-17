import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { User } from '@lib/types/user';

type UserDetailsProps = Pick<
  User,
  | 'id'
  | 'bio'
  | 'name'
  | 'photoURL'
  | 'totalTweets'
  | 'coverPhotoURL'
  | 'username'
  | 'verified'
  | 'following'
  | 'followers'
  | 'theme'
  | 'createdAt'
  | 'accent'
  | 'website'
  | 'location'
  | 'totalPhotos'
>;

type UserContext = {
  user: UserDetailsProps | null;
  loading: boolean;
};

export const UserContext = createContext<UserContext | null>(null);

type UserContextProviderProps = {
  value: UserContext;
  children: ReactNode;
};

export function UserContextProvider({
  value,
  children
}: UserContextProviderProps): JSX.Element {
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser(): UserContext {
  const context = useContext(UserContext);

  if (!context)
    throw new Error('useUser must be used within an UserContextProvider');

  return context;
}
