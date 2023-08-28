import { MediaSet, Profile, ProfileId, useProfile } from '@lens-protocol/react-web';
import { formatAvater, formatNickName, formatUser } from '@lib/FormatContent';
import type { User } from '@lib/types/user';
import { useEffect, useState } from 'react';

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
>& {
  profile: Profile;
};

type useProfileObj<T> = {
  user: UserDetailsProps;
  loading: boolean;
};

type DataWithUser<T> = useProfileObj<T & { user: UserDetailsProps }>;

export type UseProfileOptions = {
  profileId: string;
};

export function useProfileContext<T>(
  options?: UseProfileOptions
): useProfileObj<T> | DataWithUser<T> {
  const { profileId } = options ?? {};

  const [profile, setProfile] = useState<UserDetailsProps>();

  const { data, loading } = useProfile({ profileId: profileId as ProfileId });

  useEffect(() => {
    if (data) {
      let usrObj: UserDetailsProps = formatUser(data) as UserDetailsProps;
      setProfile(usrObj);
    }
  }, [data]);

  return { user: profile as UserDetailsProps, loading };
}
