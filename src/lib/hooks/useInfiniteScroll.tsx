/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Loading } from '@components/ui/loading';
import { useFetchPublications } from './useFetchPublications';
import { ExplorePublicationRequest } from '@lens-protocol/client';
import { Post } from '@lens-protocol/react-web';

import type { Tweet } from '@lib/types/tweet';

type InfiniteScroll<T> = {
  data: Tweet[] | null;
  loading: Boolean;
  LoadMore: () => JSX.Element;
};

type InfiniteScrollWithUser<T> = {
  data: Tweet[] | null;
  loading: Boolean;
  LoadMore: () => JSX.Element;
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

  const [formateList, setFormateList] = useState<Tweet[]>([]);

  useEffect(() => {
    if (data && data.length > 0) {
      let list: Tweet[] = data.map((item: Post) => ({
        id: item.id,
        text: item.metadata.content,
        images:
          item.metadata.media && item.metadata.media.length
            ? item.metadata.media.map((img, index) => {
                return {
                  id: index.toString(),
                  src: img.original.url,
                  alt: img.original.altTag ? img.original.altTag : ''
                };
              })
            : null,
        parent: null,
        userLikes: 0,
        user: item.profile,
        createdBy: ' ',
        createdAt: item.createdAt,
        updatedAt: '',
        userReplies: item.stats.commentsCount,
        userRetweets: 0
      }));
      setFormateList(list);
      console.log('list', list.length);
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
