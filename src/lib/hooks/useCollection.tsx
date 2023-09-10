import {
  Profile,
  ProfileId,
  ProfileSortCriteria,
  useExploreProfiles
} from '@lens-protocol/react-web';
import { formatUser } from '@lib/FormatContent';
import { User } from '@lib/types/user';
import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loading } from '@components/ui/loading';

type UseCollection<T> = {
  data: UserCardProps[] | null;
  loading: boolean;
  LoadMore: () => JSX.Element;
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

  const [loadMoreInView, setLoadMoreInView] = useState(false);

  const { limit, observerId, sortCriteria } = options ?? {};

  const { data, loading, hasMore, next } = useExploreProfiles({
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

  useEffect(() => {
    if (loadMoreInView) {
      if (!hasMore) return;
      next();
    }
  }, [loadMoreInView]);

  const makeItInView = (): void => setLoadMoreInView(true);
  const makeItNotInView = (): void => setLoadMoreInView(false);

  const isLoadMoreHidden = !hasMore;

  const LoadMore = useCallback(
    (): JSX.Element => (
      <motion.div
        className={isLoadMoreHidden ? 'hidden' : 'block'}
        viewport={{ margin: `0px 0px 1000px` }}
        onViewportEnter={makeItInView}
        onViewportLeave={makeItNotInView}
      >
        <Loading className='mt-5' />
      </motion.div>
    ),
    [isLoadMoreHidden]
  );

  return { data: formateList, loading, LoadMore };
}
