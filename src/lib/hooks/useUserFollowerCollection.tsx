/* eslint-disable react-hooks/exhaustive-deps */
import {
  Follower,
  Profile,
  ProfileId
} from '@lens-protocol/react-web';
import { formatUser } from '@lib/FormatContent';
import { User } from '@lib/types/user';
import { useCallback, useEffect, useState } from 'react';
import { useProfileFollowers } from '@lens-protocol/react-web';
import { motion } from 'framer-motion';
import { Loading } from '@components/ui/loading';

type useUserFollowerCollectionArgs =
  {
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
  profileId: ProfileId;
};
export function useUserFollowerCollection<T>(
  options: useUserFollowerCollectionOptions
): useUserFollowerCollectionArgs {

  const [formateList, setFormateList] = useState<UserCardProps[]>([]);

  const [loadMoreInView, setLoadMoreInView] = useState(false);

  const { limit, observerId, profileId } = options;

  const {
    data,
    loading,
    hasMore,
    next,
  } = useProfileFollowers({
    profileId: profileId,
    observerId: observerId,
    limit: limit
  });

  useEffect(() => {
    if (data) {
      let list: Follower[] = data
        .filter((it: Follower) => it !== undefined && it.wallet !== undefined && it.wallet.defaultProfile !== undefined);

      const res = list.map((item) => {
        let wallet = item.wallet;
        if (wallet && wallet.defaultProfile) {
          return formatUser(wallet.defaultProfile) as UserCardProps;
        }
      }).filter((item): item is UserCardProps => item !== undefined);
      setFormateList(res);
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
