import { useEffect } from 'react';

import { Publication, TweetProps } from '@components/publication/publication';
import type { RefObject } from 'react';
import { Trans, t } from '@lingui/macro';

type ViewParentTweetProps = {
  parentId: string;
  viewTweetRef: RefObject<HTMLElement>;
};

export function ViewParentTweet({
  parentId,
  viewTweetRef
}: ViewParentTweetProps): JSX.Element | null {
  // const { data, loading } = useDocument(doc(tweetsCollection, parentId), {
  //   includeUser: true,
  //   allowNull: true
  // });
  const loading = false;

  const data: TweetProps[] = [];

  // useEffect(() => {
  //   if (!loading) viewTweetRef.current?.scrollIntoView();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [data?.id, loading]);

  if (loading) return null;
  if (!data)
    return (
      <div className='px-4 pt-3 pb-2'>
        <p
          className='rounded-2xl bg-main-sidebar-background py-3 px-1 pl-4 
                     text-light-secondary dark:text-dark-secondary'
        >
          <Trans>This Post was deleted by the Post author.</Trans>{' '}
          <a
            className='custom-underline text-main-accent'
            href='https://help.twitter.com/rules-and-policies/notices-on-twitter'
            target='_blank'
            rel='noreferrer'
          >
            <Trans>Learn more</Trans>
          </a>
        </p>
      </div>
    );

  // return <Tweet parentTweet {...data} />;
  return null;
}
