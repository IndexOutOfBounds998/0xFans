/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Loading } from '@components/ui/loading';
import { formatImgList, formatUser, formatVideoList } from '@lib/FormatContent';
import {
  usePublications,
  ProfileId,
  Post,
  AnyPublication,
  PublicationMetadataFilters
} from '@lens-protocol/react-web';
import { TweetProps } from '@components/publication/publication';

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

export type UseCollectionOptions = {
  limit?: number;
  profileId: ProfileId;
  metadataFilter?: PublicationMetadataFilters;
};

export function useInfinitePublicationsScroll<T>(
  options: UseCollectionOptions
): InfiniteScroll<T> | InfiniteScrollWithUser<T> {
  const [loadMoreInView, setLoadMoreInView] = useState(false);

  const { limit, profileId, metadataFilter } = options;

  const { data, loading, hasMore, next } = usePublications({
    profileId: profileId,
    limit: limit,
    metadataFilter
  });

  const [formateList, setFormateList] = useState<TweetProps[]>([]);

  useEffect(() => {
    if (data && data.length > 0) {
      let list: TweetProps[] = data
        .filter((it) => it != null && it.__typename === 'Post')
        .map((item) => {
          item = item as Post;
          const isVideo = item?.metadata?.mainContentFocus === 'VIDEO';
          const imagesList = isVideo
            ? null
            : formatImgList(item?.metadata?.media);
          const videoList = isVideo
            ? formatVideoList(item?.metadata?.media)
            : null;
          return {
            id: item.id.toString(),
            text: item.metadata.content,
            isVideo: isVideo,
            images: imagesList,
            videos: videoList,
            parent: null,
            userLikes: 0,
            user: formatUser(item.profile),
            createdBy: ' ',
            createdAt: item.createdAt,
            updatedAt: '',
            userReplies: item.stats.commentsCount,
            userRetweets: 0,
            profile: item.profile,
            publication: item,
            isGated: item.isGated
          };
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

  let isLoadMoreHidden = !hasMore;

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
