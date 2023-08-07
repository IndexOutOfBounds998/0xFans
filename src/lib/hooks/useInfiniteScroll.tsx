/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Loading } from '@components/ui/loading';
import { useFetchPublications } from './useFetchPublications';
import { ExplorePublicationRequest } from '@lens-protocol/client';
import {  Post, Profile } from '@lens-protocol/react-web';

import type { Tweet } from '@lib/types/tweet';
import { ProfileOwnedByMe } from '@lens-protocol/react-web';
 
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

  const [tweetsLimit, setTweetsLimit] = useState(20);
  const [tweetsSize, setTweetsSize] = useState<number | null>(null);
  const [reachedLimit, setReachedLimit] = useState(false);
  const [loadMoreInView, setLoadMoreInView] = useState(false);

  const { data, loading } = useFetchPublications({
    explorePublicationRequest: request
  });

  let formateData: TweetProps[] = [];

  useEffect(() => {
    const checkLimit = tweetsSize ? tweetsLimit >= tweetsSize : false;
    setReachedLimit(checkLimit);
  }, [tweetsSize, tweetsLimit]);

  useEffect(() => {

    if (data && data.length > 0) {

      formateData = data.map((item: Post) => {
        return {
          id: item.id,
          text: item.metadata.content,
          images: item.metadata.media.map((img => {
            return {
              src: img.original.url,
              alt: img.original.altTag ? img.original.altTag : ''
            }
          })),
          parent: true,
          userLikes: [],
          user:item.profile,
          createdBy: null,
        }


      })
    }


  }, [data]);


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

  return { formateData, loading, LoadMore };
}
