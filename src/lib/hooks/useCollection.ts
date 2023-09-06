import {
  Profile,
  ProfileId,
  ProfileSortCriteria,
  useExploreProfiles,
} from '@lens-protocol/react-web';
import { formatUser } from '@lib/FormatContent';
import { User } from '@lib/types/user';
import { useEffect, useState } from 'react';

type UseCollection<T> =
  {
    data: UserCardProps[] | null;
    loading: boolean;
    user: UserCardProps[] | null;
  };

export type UserCardProps = Pick<
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
> & {
  modal?: boolean;
  follow?: boolean;
  isFollowingbserver?: boolean;
  profile: Profile;
};

type DataWithUser<T> = UseCollection<T & { user: UserCardProps }>;

export type UseCollectionOptions = {
  limit: number;
  observerId?: ProfileId;
  sortCriteria: ProfileSortCriteria;
};

export function useCollection<T>(
  options?: UseCollectionOptions
): UseCollection<T> | DataWithUser<T> {
  const [formateList, setFormateList] = useState<UserCardProps[]>([]);

  const { limit, observerId, sortCriteria } = options ?? {};

  const { data, loading } = useExploreProfiles({
    observerId,
    limit,
    sortCriteria
  });

  useEffect(() => {
    if (data) {
      let list: UserCardProps[] = data
        .filter((it) => it != null)
        .map((item) => {
          return formatUser(item) as UserCardProps;
        });
      setFormateList(list);
    }
  }, [data]);

  return { data: formateList, loading, user: formateList };
}
