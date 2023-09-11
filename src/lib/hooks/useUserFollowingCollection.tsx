/* eslint-disable react-hooks/exhaustive-deps */
import { Following, Profile, ProfileId } from '@lens-protocol/react-web';
import { formatUser } from '@lib/FormatContent';
import { User } from '@lib/types/user';
import { useCallback, useEffect, useState } from 'react';
import { useProfileFollowing } from '@lens-protocol/react-web';
import { motion } from 'framer-motion';
import { Loading } from '@components/ui/loading';
type useUserFollowerCollectionArgs = {
  data: UserCardProps[];
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

export type useUserFollowerCollectionOptions = {
  limit: number;
  observerId: ProfileId;
  walletAddress: string;
};
export function useUserFollowingCollection<T>(
  options: useUserFollowerCollectionOptions
): useUserFollowerCollectionArgs {
  const [formateList, setFormateList] = useState<UserCardProps[]>([]);

  const [loadMoreInView, setLoadMoreInView] = useState(false);

  const { limit, observerId, walletAddress } = options;

  const { data, loading, hasMore, next } = useProfileFollowing({
    walletAddress: walletAddress,
    observerId: observerId,
    limit: limit
  });

  useEffect(() => {
    if (data) {
      let list: UserCardProps[] = data
        .filter((it) => it !== undefined)
        .map((item) => {
          item = item as Following;
          return formatUser(item.profile) as UserCardProps;
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
