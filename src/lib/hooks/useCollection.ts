import {
  ProfileId,
  ProfileSortCriteria,
  useExploreProfiles,
  MediaSet
} from '@lens-protocol/react-web';
import { formatAvater, formatNickName } from '@lib/FormatContent';
import { User } from '@lib/types/user';
import { useEffect, useState } from 'react';

type UseCollection<T> =
  | {
      data: T[] | null;
      loading: boolean;
      user: User[];
    }
  | {
      data: (T & { user: UserCardProps })[] | null;
      loading: boolean;
      user: User[];
    }
  | {
      data: UserCardProps[] | null;
      loading: boolean;
      user: UserCardProps[] | null;
    };

type UserCardProps = Pick<
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
  const { limit, observerId, sortCriteria } = options ?? {};

  const [formateList, setFormateList] = useState<UserCardProps[]>([]);

  const { data, loading } = useExploreProfiles({
    observerId,
    limit,
    sortCriteria
  });

  useEffect(() => {
    if (data) {
      let list: UserCardProps[] = data.map((item) => {
        return {
          id: item.id,
          bio: item.bio,
          name: formatNickName(item.handle),
          username: item.handle,
          photoURL: formatAvater((item?.picture as MediaSet)?.original?.url),
          verified: true,
          following: [],
          followers: [],
          coverPhotoURL: (item?.coverPicture as MediaSet)?.original.url,
          totalTweets: 0,
          theme: null,
          updatedAt: null,
          location: '',
          totalPhotos: 0,
          pinnedTweet: null,
          accent: null,
          website: null,
          createdAt: null
        };
      });

      setFormateList(list);
    }
  }, [data]);

  return { data: formateList, loading, user: formateList };
}
