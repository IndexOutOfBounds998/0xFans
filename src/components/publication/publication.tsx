import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import cn from 'clsx';
import { useModal } from '@lib/hooks/useModal';
import { delayScroll } from '@lib/utils';
import { Modal } from '@components/modal/modal';
import { PublicationReplyModal } from '@components/modal/publication-reply-modal';
import { PublicationCollectModal } from '@components/modal/publication-collect-modal';
import { PublicationFollowModal } from '@components/modal/publication-follow-modal';
import { ImagePreview } from '@components/input/image-preview';
import { UserAvatar } from '@components/user/user-avatar';
import { UserTooltip } from '@components/user/user-tooltip';
import { UserName } from '@components/user/user-name';
import { UserUsername } from '@components/user/user-username';
import { PublicationActions } from './publication-actions';
import { PublicationStatus } from './publication-status';
import { PublicationStats } from './publication-stats';
import { PublicationDate } from './publication-date';
import type { Variants } from 'framer-motion';
import type { Tweet } from '@lib/types/tweet';
import { User } from '@lib/types/user';
import { VideoPreview } from '@components/input/video-preview';
import { GatedPreview } from '@components/input/gated-preview';
import {
  ContentPublication,
  Profile,
  PublicationId,
  usePublication
} from '@lens-protocol/react-web';
import { useEffect } from 'react';
import { useAuth } from '@lib/context/auth-context';
export type TweetProps = Tweet & {
  user: User;
  modal?: boolean;
  pinned?: boolean;
  profile: Profile;
  parentTweet?: boolean;
  canComment?: boolean;
  canMirror?: boolean;
  isGated?: boolean;
};

export const variants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.8 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

export function Publication(tweet: TweetProps): JSX.Element {
  const {
    id: tweetId,
    text,
    modal,
    isVideo,
    videos,
    images,
    parent,
    pinned,
    profile,
    userLikes,
    createdBy,
    createdAt,
    parentTweet,
    userReplies,
    userRetweets,
    user,
    canComment,
    canMirror,
    publication,
    isGated
  } = tweet;

  const { id: ownerId, name, username, photoURL, coverPhotoURL } = user ?? {};

  // const { user } = useAuth();

  const { open, openModal, closeModal } = useModal();
  const {
    open: openCollect,
    openModal: openCollectModal,
    closeModal: closeCollectModal
  } = useModal();
  const {
    open: openFollow,
    openModal: openFollowModal,
    closeModal: closeFollowModal
  } = useModal();

  const tweetLink = `/publication/${tweetId}`;

  const { user: profileMe, profileByMe } = useAuth();

  const userId = profileMe?.id as string;

  const isOwner = userId === ownerId;

  const { id: parentId, username: parentUsername = name } = parent ?? {};

  const {
    id: profileId,
    name: profileName,
    name: profileUsername
  } = profile ?? {};

  let tweetIsRetweeted;
  if (userRetweets) tweetIsRetweeted = '';

  return (
    <motion.article
      {...(!modal ? { ...variants, layout: 'position' } : {})}
      animate={{
        ...variants.animate,
        ...(parentTweet && { transition: { duration: 0.2 } })
      }}
    >
      <Modal
        className='flex items-start justify-center'
        modalClassName='bg-main-background rounded-2xl max-w-xl w-full my-8 overflow-hidden'
        open={open}
        closeModal={closeModal}
      >
        <PublicationReplyModal tweet={tweet} closeModal={closeModal} />
      </Modal>
      <Modal
        modalClassName='flex flex-col gap-6 max-w-sm bg-main-background w-full rounded-2xl'
        open={openCollect}
        closeModal={closeCollectModal}
      >
        <PublicationCollectModal
          publication={tweet.publication}
          closeModal={closeCollectModal}
        />
      </Modal>
      <Modal
        modalClassName='flex flex-col gap-6 max-w-md bg-main-background w-full rounded-2xl'
        open={openFollow}
        closeModal={closeFollowModal}
      >
        <PublicationFollowModal tweet={tweet} closeModal={closeFollowModal} />
      </Modal>
      <Link href={tweetLink} scroll={!canComment}>
        <span
          className={cn(
            `accent-tab hover-card relative flex flex-col 
      
            gap-y-4 px-4 py-3 outline-none duration-200`,
            parentTweet
              ? 'mt-0.5 pt-2.5 pb-0'
              : 'border-b border-light-border dark:border-dark-border'
          )}
          onClick={delayScroll(200)}
        >
          <div className='grid grid-cols-[auto,1fr] gap-x-3 gap-y-1'>
            <AnimatePresence initial={false}>
              {modal ? null : pinned ? (
                <PublicationStatus type='pin'>
                  <p className='text-sm font-bold'>Pinned Post</p>
                </PublicationStatus>
              ) : (
                tweetIsRetweeted && (
                  <PublicationStatus type='tweet'>
                    {/*<Link href={profileUsername as string}>*/}
                    <span className='custom-underline truncate text-sm font-bold'>
                      {userId === profileId ? 'You' : profileName} Retweeted
                    </span>
                    {/*</Link>*/}
                  </PublicationStatus>
                )
              )}
            </AnimatePresence>
            <div className='flex flex-col items-center gap-2'>
              <UserTooltip
                avatar
                modal={modal}
                profile={profile}
                {...user}
                name={user?.name ?? ''}
                username={username ?? ''}
                bio={user?.bio ?? ''}
                verified={user?.verified ?? false}
                coverPhotoURL={coverPhotoURL ?? ''}
                photoURL={photoURL ?? ''}
                id={ownerId ?? ''}
              >
                <UserAvatar
                  src={photoURL ?? ''}
                  alt={name?.toString() ?? ''}
                  id={ownerId?.toString() ?? ''}
                />
              </UserTooltip>
              {parentTweet && (
                <i className='hover-animation h-full w-0.5 bg-light-line-reply dark:bg-dark-line-reply' />
              )}
            </div>
            <div className='flex min-w-0 flex-col'>
              <div className='flex justify-between gap-2 text-light-secondary dark:text-dark-secondary'>
                <div className='flex gap-1 truncate xs:overflow-visible xs:whitespace-normal'>
                  <UserTooltip modal={modal} {...user} profile={profile}>
                    <UserName
                      id={ownerId}
                      name={name ?? ''}
                      username={username}
                      verified={false}
                      className='text-light-primary dark:text-dark-primary'
                    />
                  </UserTooltip>
                  <UserTooltip modal={modal} {...user} profile={profile}>
                    <UserUsername id={ownerId} username={username ?? ''} />
                  </UserTooltip>
                  <PublicationDate
                    tweetLink={tweetLink}
                    createdAt={createdAt}
                  />
                </div>
                <div className='px-4'>
                  {!modal && profileByMe && (
                    <PublicationActions
                      isOwner={isOwner}
                      ownerId={ownerId?.toString() ?? ''}
                      tweetId={tweetId}
                      parentId={parentId}
                      username={username ?? ''}
                      hasImages={!!images}
                      createdBy={createdBy}
                      followee={profile}
                      follower={profileByMe}
                    />
                  )}
                </div>
              </div>
              {/* {(canComment || modal) && (
                <p
                  className={cn(
                    'text-light-secondary dark:text-dark-secondary',
                    modal && 'order-1 my-2'
                  )}
                >
                  Replying to{' '}
                  <Link href={`/user/${profile.id}`}>
                    <span className='custom-underline text-main-accent'>
                      @{parentUsername}
                    </span>
                  </Link>
                </p>
              )} */}
              <div className='mt-1 flex flex-col gap-2'>
                {!isGated && text && (
                  <p className='whitespace-pre-line break-words'>{text}</p>
                )}
                {isGated ? (
                  <GatedPreview
                    publication={tweet}
                    openCollectModal={openCollectModal}
                    openFollowModal={openFollowModal}
                  />
                ) : isVideo ? (
                  videos && <VideoPreview tweet videoPreview={videos} />
                ) : (
                  images && (
                    <ImagePreview
                      tweet
                      imagesPreview={images}
                      previewCount={images ? images.length : 0}
                    />
                  )
                )}
                {!modal && (
                  <PublicationStats
                    publication={publication}
                    canComment={canComment}
                    canMirror={canMirror}
                    userId={userId}
                    tweetId={tweetId}
                    userLikes={userLikes}
                    userReplies={userReplies}
                    userRetweets={userRetweets}
                    openModal={!parent ? openModal : undefined}
                    openCollectModal={openCollectModal}
                  />
                )}
              </div>
            </div>
          </div>
        </span>
      </Link>
    </motion.article>
  );
}
