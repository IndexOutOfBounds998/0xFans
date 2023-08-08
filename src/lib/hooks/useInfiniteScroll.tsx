/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Loading } from '@components/ui/loading';
import { useFetchPublications } from './useFetchPublications';
import { ExplorePublicationRequest } from '@lens-protocol/client';
import { Post, Profile } from '@lens-protocol/react-web';

import type { Tweet } from '@lib/types/tweet';
import { ProfileOwnedByMe } from '@lens-protocol/react-web';
import { Timestamp } from 'firebase/firestore';

type InfiniteScroll<T> = {
  data: T[] | null;
  loading: boolean;
  LoadMore: () => JSX.Element;
};

type InfiniteScrollWithUser<T> = {
  data: (T & { user: Profile })[] | null;
  loading: boolean;
  LoadMore: () => JSX.Element;
};

export type TweetProps = Tweet & {
  user: ProfileOwnedByMe;
  modal?: boolean;
  pinned?: boolean;
  profile?: ProfileOwnedByMe | null;
  parentTweet?: boolean;
};

export function useInfiniteScroll<T>(
  request: ExplorePublicationRequest
): InfiniteScrollWithUser<T>;

export function useInfiniteScroll<T>(
  request: ExplorePublicationRequest
): InfiniteScroll<T> | InfiniteScrollWithUser<T> {
  const [loadMoreInView, setLoadMoreInView] = useState(false);

  const { data, loading, next, hasMore } = useFetchPublications({
    explorePublicationRequest: request
  });

  const [formateList, setFormateList] = useState<TweetProps[]>([]);

  useEffect(() => {
    if (data && data.length > 0) {
      let list: TweetProps[] = [];
      data.forEach((item: Post) => {
        list.push({
          id: item.id,
          text: item.metadata.content,
          images: item.metadata.media
            ? item.metadata.media.map((img, index) => {
                return {
                  id: index.toString(),
                  src: img.original.url,
                  alt: img.original.altTag ? img.original.altTag : ''
                };
              })
            : [],
          parent: null,
          userLikes: [],
          user: item.profile,
          createdBy: item.profile.handle,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          userReplies: item.stats.commentsCount,
          userRetweets: []
        });
      });
      setFormateList(list);
    }
    console.log();
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
