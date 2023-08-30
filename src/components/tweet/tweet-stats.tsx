/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect, useMemo } from 'react';
import cn from 'clsx';

import { ViewTweetStats } from '@components/view/view-tweet-stats';
import { TweetOption } from './tweet-option';
import { TweetShare } from './tweet-share';
import type { Tweet } from '@lib/types/tweet';
import { ContentPublication, Post, ReactionType, profileId, publicationId, usePublication, useReaction } from '@lens-protocol/react-web';
import { useAuth } from '@lib/context/auth-context';

type TweetStatsProps = Pick<
  Tweet,
  'userLikes' | 'userRetweets' | 'userReplies' | 'publication'
> & {
  userId: string;
  isOwner: boolean;
  tweetId: string | null;
  viewTweet?: boolean;
  canComment?: boolean;
  canMirror?: boolean;
  openModal?: () => void;
};

export function TweetStats({
  userId,
  isOwner,
  tweetId,
  userLikes,
  viewTweet,
  userRetweets,
  userReplies: totalReplies,
  openModal,
  canComment,
  canMirror
}: TweetStatsProps): JSX.Element {
  const totalLikes = userLikes ? userLikes : 0;
  const totalTweets = userRetweets ? userRetweets : 0;

  const [{ currentReplies, currentTweets, currentLikes }, setCurrentStats] =
    useState({
      currentReplies: totalReplies,
      currentLikes: totalLikes,
      currentTweets: totalTweets
    });

  useEffect(() => {
    setCurrentStats({
      currentReplies: totalReplies,
      currentLikes: totalLikes,
      currentTweets: totalTweets
    });
  }, [totalReplies, totalLikes, totalTweets]);

  const replyMove = useMemo(
    () => (totalReplies || 0 > (currentReplies || 0) ? -25 : 25),
    [totalReplies]
  );

  const likeMove = useMemo(
    () => (totalLikes > currentLikes ? -25 : 25),
    [totalLikes]
  );

  const tweetMove = useMemo(
    () => (totalTweets > currentTweets ? -25 : 25),
    [totalTweets]
  );

  const tweetIsRetweeted = '';

  const isStatsVisible = !!(totalReplies || totalTweets || totalLikes);

  const { user: profileUser } = useAuth();

  const { data: publication, loading: publicatioLoading } = usePublication({
    publicationId: publicationId(tweetId as string),
    observerId: profileId(profileUser?.id as string),
  });

  const { addReaction, removeReaction, hasReaction, isPending } = useReaction({
    profileId: profileId(profileUser?.id as string)
  });

  const hasReactionType = publication ? hasReaction({
    reactionType: ReactionType.UPVOTE,
    publication: (publication as Post)
  }) : false;

  let [loading, setLoading] = useState(false);

  const toggleReaction = async () => {
    if (!profileId) {
      return;
    }
    const reactionType = ReactionType.UPVOTE;
    const targetPublication = (publication as ContentPublication);

    setLoading(true);
    debugger
    if (hasReactionType) {
      await removeReaction({
        reactionType,
        publication: targetPublication,
      });
    } else {
      await addReaction({
        reactionType,
        publication: targetPublication,
      });
    }
    setLoading(false);
  };

  return (
    <>
      {viewTweet && (
        <ViewTweetStats
          likeMove={likeMove}
          userLikes={userLikes}
          tweetMove={tweetMove}
          replyMove={replyMove}
          userRetweets={userRetweets}
          currentLikes={currentLikes}
          currentTweets={currentTweets}
          currentReplies={currentReplies}
          isStatsVisible={isStatsVisible}
        />
      )}
      <div
        className={cn(
          'flex text-light-secondary inner:outline-none dark:text-dark-secondary',
          viewTweet ? 'justify-around py-2' : 'max-w-md justify-between'
        )}
      >
        <TweetOption
          className='hover:text-accent-blue focus-visible:text-accent-blue'
          iconClassName='group-hover:bg-accent-blue/10 group-active:bg-accent-blue/20
                         group-focus-visible:bg-accent-blue/10 group-focus-visible:ring-accent-blue/80'
          tip='Reply'
          move={replyMove}
          stats={currentReplies}
          iconName='ChatBubbleOvalLeftIcon'
          viewTweet={viewTweet}
          onClick={openModal}
          disabled={!canComment}
        />
        <TweetOption
          className={cn(
            'hover:text-accent-green focus-visible:text-accent-green',
            tweetIsRetweeted && 'text-accent-green [&>i>svg]:[stroke-width:2px]'
          )}
          iconClassName='group-hover:bg-accent-green/10 group-active:bg-accent-green/20
                         group-focus-visible:bg-accent-green/10 group-focus-visible:ring-accent-green/80'
          tip={tweetIsRetweeted ? 'Undo Retweet' : 'Retweet'}
          move={tweetMove}
          stats={currentTweets}
          iconName='ArrowPathRoundedSquareIcon'
          viewTweet={viewTweet}
          disabled={!canMirror}
        // onClick={manageRetweet(
        //   tweetIsRetweeted ? 'unretweet' : 'retweet',
        //   userId,
        //   tweetId??''
        // )}
        />
        <TweetOption
          className={cn(
            'hover:text-accent-pink focus-visible:text-accent-pink',
            hasReactionType && 'text-accent-pink [&>i>svg]:fill-accent-pink'
          )}
          iconClassName='group-hover:bg-accent-pink/10 group-active:bg-accent-pink/20
                         group-focus-visible:bg-accent-pink/10 group-focus-visible:ring-accent-pink/80'
          tip={hasReactionType ? 'Unlike' : 'Like'}
          move={likeMove}
          stats={currentLikes}
          iconName='HeartIcon'
          viewTweet={viewTweet}
          onClick={() => toggleReaction()}
        />
        <TweetShare
          userId={userId}
          tweetId={tweetId ?? ''}
          viewTweet={viewTweet}
        />
        {isOwner && (
          <TweetOption
            className='hover:text-accent-blue focus-visible:text-accent-blue'
            iconClassName='group-hover:bg-accent-blue/10 group-active:bg-accent-blue/20
                           group-focus-visible:bg-accent-blue/10 group-focus-visible:ring-accent-blue/80'
            tip='Analytics'
            iconName='ChartPieIcon'
            disabled
          />
        )}
      </div>
    </>
  );
}
