import { useProfile } from '@lens-protocol/react-web';
import { formatAvater, formatNickName } from '@lib/FormatContent';
import type { User } from '@lib/types/user';
import { useEffect, useState } from 'react';

type useProfileObj<T> = {
  user: User;
  loading: boolean;
};

type useProfiles = User & {
  modal?: boolean;
  follow?: boolean;
};

type DataWithUser<T> = useProfileObj<T & { user: useProfiles }>;

export type UseProfileOptions = {
  profileId: string;
};

export function useProfileContext<T>(
  options?: UseProfileOptions
): useProfileObj<T> | DataWithUser<T> {
  const { profileId } = options ?? {};

  const [profile, setProfile] = useState<useProfiles>({});

  const { data, loading } = useProfile({ profileId: profileId });

  useEffect(() => {
    if (data) {
      let usrObj: useProfiles | {} = {
        id: data.id,
        bio: data.bio,
        name: formatNickName(data.handle),
        username: data.name,
        photoURL: formatAvater(data?.picture?.original?.url),
        verified: true,
        following: [],
        followers: [],
        totalTweets: data?.stats?.totalPosts,
        coverPhotoURL: data.coverPicture
      };
      setProfile(usrObj);
    }
  }, [data]);

  return { user: profile, loading };
}
