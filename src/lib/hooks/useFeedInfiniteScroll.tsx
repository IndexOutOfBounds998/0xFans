/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Loading } from '@components/ui/loading';

import { FeedItem, Post, ProfileId } from '@lens-protocol/react-web';
import { formatImgList, formatUser, formatVideoList } from '@lib/FormatContent';
import { TweetProps } from '@components/tweet/tweet';
import { useFeed } from '@lens-protocol/react-web';
type InfiniteScroll<T> = {
  data: TweetProps[] | null;
  loading: Boolean;
  LoadMore: () => JSX.Element;
};

type InfiniteScrollWithUser<T> = {
  data: TweetProps[] | null;
  loading: Boolean;
  LoadMore: () => JSX.Element;
};

export function useFeedInfiniteScroll<T>(
  profileId: ProfileId
): InfiniteScrollWithUser<T>;

export function useFeedInfiniteScroll<T>(
  profileId: ProfileId
): InfiniteScroll<T> | InfiniteScrollWithUser<T> {
  const [loadMoreInView, setLoadMoreInView] = useState(false);

  const {
    data,
    loading,
    hasMore,
    next,
  } = useFeed({
    profileId: profileId,
    limit: 20,
  });
  const [formateList, setFormateList] = useState<TweetProps[]>([]);

  useEffect(() => {
    if (data && data.length > 0) {
      let list: TweetProps[] = data
        .filter((it) => it != null)
        .map((item: FeedItem) => {

          const isVideo = item.root?.metadata?.mainContentFocus === 'VIDEO';
          const imagesList = isVideo
            ? null
            : formatImgList(item.root?.metadata?.media);
          const videoList = isVideo
            ? formatVideoList(item.root?.metadata?.media)
            : null;
          return {
            id: item.root.id.toString(),
            text: item.root.metadata.content,
            isVideo: isVideo,
            images: imagesList,
            videos: videoList,
            parent: null,
            userLikes: 0,
            user: formatUser(item.root.profile),
            createdBy: ' ',
            createdAt: item.root.createdAt,
            updatedAt: '',
            userReplies: item.root.stats.commentsCount,
            userRetweets: 0,
            profile: item.root.profile,
            publication: item.root
          };
        });
      console.log(list);
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
