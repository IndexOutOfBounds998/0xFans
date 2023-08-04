/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Loading } from '@components/ui/loading';
import { useFetchPublications } from './useFetchPublications';
import { ExplorePublicationRequest } from '@lens-protocol/client';
import { Profile } from '@lens-protocol/react-web';
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

export function useInfiniteScroll<T>(
  request: ExplorePublicationRequest
): InfiniteScrollWithUser<T>;

export function useInfiniteScroll<T>(
  request: ExplorePublicationRequest
): InfiniteScroll<T> | InfiniteScrollWithUser<T> {

  const [tweetsLimit, setTweetsLimit] = useState(20);
  const [tweetsSize, setTweetsSize] = useState<number | null>(null);
  const [reachedLimit, setReachedLimit] = useState(false);
  const [loadMoreInView, setLoadMoreInView] = useState(false);

  const { data, loading } = useFetchPublications({
    explorePublicationRequest: request
  });

  useEffect(() => {
    const checkLimit = tweetsSize ? tweetsLimit >= tweetsSize : false;
    setReachedLimit(checkLimit);
  }, [tweetsSize, tweetsLimit]);

  useEffect(() => {
    if (reachedLimit) return;

    const setTweetsLength = async (): Promise<void> => {
      setTweetsSize(data.length);
    };

    void setTweetsLength();
  }, [data?.length]);

  useEffect(() => {
    if (reachedLimit) return;
    if (loadMoreInView) setTweetsLimit(tweetsLimit + (20));
  }, [loadMoreInView]);

  const makeItInView = (): void => setLoadMoreInView(true);
  const makeItNotInView = (): void => setLoadMoreInView(false);

  const isLoadMoreHidden =
    reachedLimit && (data?.length ?? 0) >= (tweetsSize ?? 0);

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

  return { data, loading, LoadMore };
}
