import { MediaSet, ProfileId, useProfile } from '@lens-protocol/react-web';
import { formatAvater, formatNickName } from '@lib/FormatContent';
import type { User } from '@lib/types/user';
import { useEffect, useState } from 'react';

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
  | 'createdAt'
  | 'followers'
  | 'theme'
  | 'accent'
  | 'website'
  | 'location'
  | 'updatedAt'
  | 'totalPhotos'
  | 'pinnedTweet'
>;

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
      let usrObj: UserDetailsProps = {
        id: data.id,
        bio: data.bio,
        name: formatNickName(data.handle),
        username: data?.name || '',
        photoURL: formatAvater((data?.picture as MediaSet)?.original?.url),
        verified: true,
        following: [],
        followers: [],
        totalTweets: data?.stats?.totalPosts,
        coverPhotoURL: (data?.coverPicture as MediaSet)?.original.url,
        theme: null,
        accent: null,
        website: '',
        location: '',
        createdAt: null
      };
      setProfile(usrObj);
    }
  }, [data]);

  return { user: profile as User, loading };
}
