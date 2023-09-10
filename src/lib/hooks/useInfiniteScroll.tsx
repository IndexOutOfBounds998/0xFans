/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Loading } from '@components/ui/loading';
import {
  Post,
  PublicationMainFocus,
  PublicationSortCriteria,
  PublicationTypes
} from '@lens-protocol/react-web';
import { formatImgList, formatUser, formatVideoList } from '@lib/FormatContent';
import { TweetProps } from '@components/tweet/tweet';
import { useExplorePublications } from '@lens-protocol/react-web';
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

export function useInfiniteScroll<T>(): InfiniteScrollWithUser<T>;

export function useInfiniteScroll<T>():
  | InfiniteScroll<T>
  | InfiniteScrollWithUser<T> {
  const [loadMoreInView, setLoadMoreInView] = useState(false);

  const { data, loading, hasMore, next } = useExplorePublications({
    limit: 20,
    sortCriteria: PublicationSortCriteria.Latest,
    publicationTypes: [PublicationTypes.Post],
    metadataFilter: {
      restrictPublicationMainFocusTo: [
        PublicationMainFocus.Image,
        PublicationMainFocus.TextOnly,
        PublicationMainFocus.Video
      ]
    }
  });

  const [formateList, setFormateList] = useState<TweetProps[]>([]);

  useEffect(() => {
    if (data && data.length > 0) {
      let list: TweetProps[] = data
        .filter((it) => it != null && it.__typename === 'Post')
        .sort(function (i, j) {
          let time1 = new Date(j.createdAt).getTime();
          let time2 = new Date(i.createdAt).getTime();
          return time1 - time2;
        })
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
            canComment: item.canComment.result,
            canMirror: item.canMirror.result,
            publication: item,
            isGated: item.isGated
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
