import { ProfileId, ProfileSortCriteria, useExploreProfiles } from '@lens-protocol/react-web';
import { formatAvater } from '@lib/FormatContent';
import { User } from '@lib/types/user';
import { useEffect, useState } from 'react';

type UseCollection<T> = {
  data: T[] | null;
  loading: boolean;
  user: User[];
} | {
  data: (T & { user: UserCardProps })[] | null;
  loading: boolean;
  user: User[];
}
  | {
    data: UserCardProps[] | null;
    loading: boolean;
    user: User[];
  };


type UserCardProps = User & {
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
      let list: UserCardProps[] = data.map((item => {
        return {
          id: item.id,
          bio: item.bio,
          name: item.name,
          username: item.handle,
          photoURL: item.picture ? formatAvater(item.picture.original.url) : "",
          verified: true,
          following: [],
          followers: [],
          coverPhotoURL: item.coverPicture ? formatAvater(item.coverPicture.original.url) : item.picture ? formatAvater(item.picture.original.url) : ""
        }

      }))

      setFormateList(list);
    }

  }, [data])

  return { data: formateList, loading, user: formateList };
}
