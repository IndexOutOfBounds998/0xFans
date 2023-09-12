import Link from 'next/link';
import { motion } from 'framer-motion';
import cn from 'clsx';
import { useAuth } from '@lib/context/auth-context';
import { useModal } from '@lib/hooks/useModal';
import { Modal } from '@components/modal/modal';
import { PublicationReplyModal } from '@components/modal/publication-reply-modal';
import { ImagePreview } from '@components/input/image-preview';
import { UserAvatar } from '@components/user/user-avatar';
import { UserTooltip } from '@components/user/user-tooltip';
import { UserName } from '@components/user/user-name';
import { UserUsername } from '@components/user/user-username';
import { variants } from '@components/publication/publication';
import { PublicationActions } from '@components/publication/publication-actions';
import {PublicationStats } from '@components/publication/publication-stats';
import { PublicationDate } from '@components/publication/publication-date';
import { Input } from '@components/input/input';
import type { RefObject } from 'react';
import type { User } from '@lib/types/user';
import type { Tweet } from '@lib/types/tweet';
import { VideoPreview } from '@components/input/video-preview';
import { GatedPreview } from '@components/input/gated-preview';
import {PublicationCollectModal } from '@components/modal/publication-collect-modal';
import { PublicationFollowModal } from '@components/modal/publication-follow-modal';
import {
  ContentPublication,
  PublicationId,
  usePublication
} from '@lens-protocol/react-web';
type ViewTweetProps = Tweet & {
  user: User;
  viewTweetRef?: RefObject<HTMLElement>;
  canComment?: boolean;
  canMirror?: boolean;
  isGated?: boolean;
};

export function ViewPublication(tweet: ViewTweetProps): JSX.Element {
  const {
    id: tweetId,
    text,
    isVideo,
    videos,
    images,
    parent,
    userLikes,
    createdBy,
    createdAt,
    userRetweets,
    userReplies,
    viewTweetRef,
    user: tweetUserData,
    profile,
    canComment,
    canMirror,
    publication,
    isGated
  } = tweet;

  const { id: ownerId, name, username, verified, photoURL } = tweetUserData;

  const { user } = useAuth();

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

  const userId = user?.id as string;

  const isOwner = userId === createdBy;

  const { id: parentId, username: parentUsername = username } = parent ?? {};

  return (
    <motion.article
      className={cn(
        `accent-tab h- relative flex cursor-default flex-col gap-3 border-b
         border-light-border px-4 py-3 outline-none dark:border-dark-border`,
        canComment && 'scroll-m-[3.25rem] pt-0'
      )}
      {...variants}
      animate={{ ...variants.animate, transition: { duration: 0.2 } }}
      exit={undefined}
      ref={viewTweetRef}
    >
      <Modal
        className='flex items-start justify-center'
        modalClassName='bg-main-background rounded-2xl max-w-xl w-full mt-8 overflow-hidden'
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
          publication={tweet.publication as ContentPublication}
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
      <div className='flex flex-col gap-2'>
        {canComment && (
          <div className='flex w-12 items-center justify-center'>
            <i className='hover-animation h-2 w-0.5 bg-light-line-reply dark:bg-dark-line-reply' />
          </div>
        )}
        <div className='grid grid-cols-[auto,1fr] gap-3'>
          <UserTooltip avatar {...tweetUserData} profile={profile}>
            <UserAvatar src={photoURL} alt={name ?? ''} username={username} />
          </UserTooltip>
          <div className='flex min-w-0 justify-between'>
            <div className='flex flex-col truncate xs:overflow-visible xs:whitespace-normal'>
              <UserTooltip {...tweetUserData} profile={profile}>
                <UserName
                  id={ownerId}
                  className='-mb-1'
                  name={name ?? ''}
                  username={username}
                  verified={verified}
                />
              </UserTooltip>
              <UserTooltip {...tweetUserData} profile={profile}>
                <UserUsername id={ownerId} username={username} />
              </UserTooltip>
            </div>
            <div className='px-4'>
              <PublicationActions
                viewTweet
                isOwner={isOwner}
                ownerId={ownerId.toString()}
                tweetId={tweetId}
                parentId={parentId}
                username={username}
                hasImages={!!images}
                createdBy={createdBy}
              />
            </div>
          </div>
        </div>
      </div>
      {canComment && (
        <p className='text-light-secondary dark:text-dark-secondary'>
          Replying to{' '}
          <Link href={`/user/${profile.id}`}>
            <span className='custom-underline text-main-accent'>
              @{parentUsername}
            </span>
          </Link>
        </p>
      )}
      <div>
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
              previewCount={images.length}
            />
          )
        )}
        {/*{images && (*/}
        {/*  <ImagePreview*/}
        {/*    viewTweet*/}
        {/*    imagesPreview={images}*/}
        {/*    previewCount={images.length}*/}
        {/*  />*/}
        {/*)}*/}
        <div
          className='inner:hover-animation inner:border-b inner:border-light-border
                     dark:inner:border-dark-border'
        >
          <PublicationDate viewTweet tweetLink={tweetLink} createdAt={createdAt} />
          <PublicationStats
            publication={publication}
            viewTweet
            canComment={canComment}
            canMirror={canMirror}
            userId={userId}
            tweetId={tweetId}
            userLikes={userLikes}
            userRetweets={userRetweets}
            userReplies={userReplies}
            openModal={openModal}
            openCollectModal={openCollectModal}
          />
        </div>
        <Input reply parent={{ id: tweetId ?? '', username: username }} />
      </div>
    </motion.article>
  );
}
