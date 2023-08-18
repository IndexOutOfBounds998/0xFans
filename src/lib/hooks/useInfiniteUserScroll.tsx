/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Loading } from '@components/ui/loading';
import { MediaSet, ProfileId, ProfileSortCriteria, useExploreProfiles } from '@lens-protocol/react-web';
 
import { User } from '@lib/types/user';
import { formatAvater, formatNickName } from '@lib/FormatContent';

type InfiniteScroll<T> = {
  data: User[] | null;
  loading: Boolean;
  LoadMore: () => JSX.Element;
};

type InfiniteScrollWithUser<T> = {
  data: (User)[] | null;
  loading: Boolean;
  LoadMore: () => JSX.Element;
};

export type UseCollectionOptions = {
  limit: number;
  observerId?: ProfileId;
  sortCriteria: ProfileSortCriteria;
};

export function useInfiniteUserScroll<T>(
  options?: UseCollectionOptions
): InfiniteScroll<T> | InfiniteScrollWithUser<T> {

  const [loadMoreInView, setLoadMoreInView] = useState(false);

  const { limit, observerId, sortCriteria } = options ?? {};

  const { data, loading,hasMore,next } = useExploreProfiles({
    observerId,
    limit,
    sortCriteria
  });

  const [formateList, setFormateList] = useState<User[]>([]);

  useEffect(() => {
    if (data) {
      let list: User[] = data.map((item) => {
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

      setFormateList((prevList) => [...prevList, ...list]);
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