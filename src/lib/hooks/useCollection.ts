import { ProfileId, useExploreProfiles } from '@lens-protocol/react-web';
import { formatAvater } from '@lib/FormatContent';
import { User } from '@lib/types/user';
import { useEffect, useState } from 'react';

type UseCollection<T> = {
  data: T[] | null;
  loading: boolean;
} | {
  data: (T & { user: UserCardProps })[] | null;
  loading: boolean;
};


type UserCardProps = User & {
  modal?: boolean;
  follow?: boolean;
};

type DataWithUser<T> = UseCollection<T & { user: UserCardProps }>;

export type UseCollectionOptions = {
  limit: number;
  observerId?: ProfileId;
};


export function useCollection<T>(
  options?: UseCollectionOptions
): UseCollection<T> | DataWithUser<T> {

  const { limit, observerId } = options ?? {};


  const [formateList, setFormateList] = useState<UserCardProps[]>([]);

 

  const { data, loading } = useExploreProfiles({
    observerId,
    limit
  });


  useEffect(() => {

    if (data) {
      let list: UserCardProps[] =   data.map((item => {
      
         return {
            id: item.id,
            bio: item.bio,
            name: item.handle,
            username: item.name,
            photoURL: formatAvater(item.picture.original.url),
            verified: true,
            following: [],
            followers: [],
            coverPhotoURL: item.coverPicture
          }
      
      }))

      setFormateList(list);
    }

  }, [data])

  return { data: formateList, loading };
}
