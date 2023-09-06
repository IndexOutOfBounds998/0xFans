import { useMemo, useEffect } from 'react';
import { getRandomId } from '@lib/random';
import { Tweet, TweetProps } from './tweet';
import type { LoadedParents } from './tweet-with-parent';

type TweetParentProps = {
  parentId: string;
  loadedParents: LoadedParents;
  addParentId: (parentId: string, componentId: string) => void;
};

export function TweetParent({
  parentId,
  loadedParents,
  addParentId
}: TweetParentProps): JSX.Element | null {
  const componentId = useMemo(getRandomId, []);

  const isParentAlreadyLoaded = loadedParents.some(
    (child) => child.childId === componentId
  );

  // const { data, loading } = useDocument(doc(tweetsCollection, parentId), {
  //   includeUser: true,
  //   allowNull: true,
  //   disabled: isParentAlreadyLoaded
  // });

  const loading = false;
  const data: TweetProps[] = [];

  useEffect(() => {
    addParentId(parentId, componentId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading || !isParentAlreadyLoaded || !data) return null;

  // return <Tweet parentTweet {...data} />;
  return null;
}
