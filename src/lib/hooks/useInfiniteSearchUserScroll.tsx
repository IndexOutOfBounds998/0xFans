
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Loading } from '@components/ui/loading';
import {
  ProfileId,
  useSearchProfiles
} from '@lens-protocol/react-web';
import { formatUser } from '@lib/FormatContent';
import { UserCardProps } from './useCollection';

type InfiniteScroll<T> = {
  data: UserCardProps[] | null;
  loading: Boolean;
  LoadMore: () => JSX.Element;
};

export type UseCollectionOptions = {
  limit: number;
  observerId?: ProfileId;
  query: string;
};

export function useInfiniteSearchUserScroll<T>(
  options: UseCollectionOptions
): InfiniteScroll<T> {
  const [loadMoreInView, setLoadMoreInView] = useState(false);

  const { limit, observerId, query } = options;

  const { data, loading, hasMore, next } = useSearchProfiles({ query: query, observerId: observerId, limit: limit })

  const [formateList, setFormateList] = useState<UserCardProps[]>([]);

  useEffect(() => {
    if (data) {
      let list: UserCardProps[] = data
        .filter((it) => it != null)
        .map((item) => {
          return formatUser(item) as UserCardProps;
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
