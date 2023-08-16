import { ProfileId, useExploreProfiles } from '@lens-protocol/react-web';
import { User } from '@lib/types/user';
import { useEffect } from 'react';

type UseCollection<T> = {
  data: T[] | null;
  loading: boolean;
};

type DataWithUser<T> = UseCollection<T & { user: User }>;

export type UseCollectionOptions = {
  limit: number;
  observerId?: ProfileId;
};


export function useCollection<T>(
  options?: UseCollectionOptions
): UseCollection<T> | DataWithUser<T> {

  const { limit, observerId } = options ?? {};

  const { data, loading } = useExploreProfiles({
    observerId,
    limit
  });

  return { data, loading };
}
