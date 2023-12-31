import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import { Popover } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import cn from 'clsx';
import { toast } from 'react-hot-toast';
import { useAuth } from '@lib/context/auth-context';
import { useModal } from '@lib/hooks/useModal';

import { delayScroll, preventBubbling, sleep } from '@lib/utils';
import { Modal } from '@components/modal/modal';
import { ActionModal } from '@components/modal/action-modal';
import { Button } from '@components/ui/button';
import { ToolTip } from '@components/ui/tooltip';
import { HeroIcon } from '@components/ui/hero-icon';
import { CustomIcon } from '@components/ui/custom-icon';
import type { Variants } from 'framer-motion';
import type { Tweet } from '@lib/types/tweet';
import type { User } from '@lib/types/user';
import { getAuthenticatedClient } from '@lib/getAuthenticatedClient';
import PubSub from 'pubsub-js';
import { useLingui } from '@lingui/react';
import { Trans, t } from '@lingui/macro';
import { useFollowWithSelfFundedFallback } from '@lib/hooks/useFollowWithSelfFundedFallback';
import { ProfileOwnedByMe, Profile, useUnfollow } from '@lens-protocol/react-web';

export const variants: Variants = {
  initial: { opacity: 0, y: -25 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', duration: 0.4 }
  },
  exit: { opacity: 0, y: -25, transition: { duration: 0.2 } }
};

type TweetActionsProps = Pick<Tweet, 'createdBy'> & {
  isOwner: boolean;
  ownerId: string | null;
  tweetId: string | null;
  username: string;
  parentId?: string;
  hasImages: boolean;
  viewTweet?: boolean;
  follower: ProfileOwnedByMe;
  followee: Profile;
};

type PinModalData = Record<'title' | 'description' | 'mainBtnLabel', string>;

const pinModalData: Readonly<PinModalData[]> = [
  {
    title: 'Pin Posts to from profile?',
    description:
      'This will appear at the top of your profile and replace any previously pinned Posts.',
    mainBtnLabel: 'Pin'
  },
  {
    title: 'Unpin Posts from profile?',
    description:
      'This will no longer appear automatically at the top of your profile.',
    mainBtnLabel: 'Unpin'
  }
];

export function PublicationActions({
  isOwner,
  ownerId,
  tweetId,
  parentId,
  username,
  hasImages,
  viewTweet,
  createdBy,
  follower,
  followee
}: TweetActionsProps): JSX.Element {
  useLingui();
  const { user } = useAuth();
  const { push, pathname } = useRouter();

  const {
    open: removeOpen,
    openModal: removeOpenModal,
    closeModal: removeCloseModal
  } = useModal();

  const {
    open: pinOpen,
    openModal: pinOpenModal,
    closeModal: pinCloseModal
  } = useModal();

  const { id: userId, following, pinnedTweet } = user as User;

  const isInAdminControl = !isOwner;

  const tweetIsPinned = pinnedTweet === tweetId;

  const handleRemove = async (): Promise<void> => {
    preventBubbling;

    if (tweetId) {
      const lensClient = await getAuthenticatedClient();
      await lensClient.publication.hide({
        publicationId: tweetId
      });

      if (pathname !== '/home') {
        push('/home');
      } else {
        PubSub.publish('delPost', tweetId);
      }

      toast.success(
        `${isInAdminControl ? `@${username}'s` : 'Your'} Post was hide`
      );

      removeCloseModal();
    }
  };

  const handlePin = async (): Promise<void> => {
    // await managePinnedTweet(tweetIsPinned ? 'unpin' : 'pin', userId, tweetId??'');
    toast.success(
      `Your tweet was ${tweetIsPinned ? 'unpinned' : 'pinned'} to your profile`
    );
    pinCloseModal();
  };

  const {
    execute: unfollow,
    error: unfollowError,
    isPending: isUnfollowPending
  } = useUnfollow({ follower, followee });

  const {
    execute: follow,
    error: followError,
    isPending: isFollowPending
  } = useFollowWithSelfFundedFallback({
    followee,
    follower
  });

  const userIsFollowed = followee.isFollowedByMe;

  const currentPinModalData = useMemo(
    () => pinModalData[+tweetIsPinned],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pinOpen]
  );

  return (
    <>
      <Modal
        modalClassName='max-w-xs bg-main-background w-full p-8 rounded-2xl'
        open={removeOpen}
        closeModal={removeCloseModal}
      >
        <ActionModal
          title={t`Delete Posts?`}
          description={t`This can’t be undone and it will be removed from ${isInAdminControl ? `@${username}'s` : 'your'
            } profile, the timeline of any accounts that follow ${isInAdminControl ? `@${username}` : 'you'
            }, and from 0xFans search results.`}
          mainBtnClassName='bg-accent-red hover:bg-accent-red/90 active:bg-accent-red/75 accent-tab
                            focus-visible:bg-accent-red/90'
          mainBtnLabel={t`Delete`}
          focusOnMainBtn
          action={handleRemove}
          closeModal={removeCloseModal}
        />
      </Modal>
      <Modal
        modalClassName='max-w-xs bg-main-background w-full p-8 rounded-2xl'
        open={pinOpen}
        closeModal={pinCloseModal}
      >
        <ActionModal
          {...currentPinModalData}
          mainBtnClassName='bg-light-primary hover:bg-light-primary/90 active:bg-light-primary/80 dark:text-light-primary
                            dark:bg-light-border dark:hover:bg-light-border/90 dark:active:bg-light-border/75'
          focusOnMainBtn
          action={handlePin}
          closeModal={pinCloseModal}
        />
      </Modal>
      <Popover>
        {({ open, close }): JSX.Element => (
          <>
            <Popover.Button
              as={Button}
              className={cn(
                `main-tab group group absolute top-2 right-2 p-2 
                 hover:bg-accent-blue/10 focus-visible:bg-accent-blue/10
                 focus-visible:!ring-accent-blue/80 active:bg-accent-blue/20`,
                open && 'bg-accent-blue/10 [&>div>svg]:text-accent-blue'
              )}
            >
              <div className='group relative'>
                <HeroIcon
                  className='h-5 w-5 text-light-secondary group-hover:text-accent-blue
                             group-focus-visible:text-accent-blue dark:text-dark-secondary/80'
                  iconName='EllipsisHorizontalIcon'
                />
                {!open && <ToolTip tip={t`More`} />}
              </div>
            </Popover.Button>
            <AnimatePresence>
              {open && (
                <Popover.Panel
                  className='menu-container group absolute top-[50px] right-2 whitespace-nowrap text-light-primary
                             dark:text-dark-primary'
                  as={motion.div}
                  {...variants}
                  static
                >
                  {isOwner && (
                    <Popover.Button
                      className='accent-tab flex w-full gap-3 rounded-md rounded-b-none p-4 text-accent-red
                                 hover:bg-main-sidebar-background'
                      as={Button}
                      onClick={preventBubbling(removeOpenModal)}
                    >
                      <HeroIcon iconName='TrashIcon' />
                      <Trans>Delete</Trans>
                    </Popover.Button>
                  )}
                  {isOwner ? (
                    <Popover.Button
                      className='accent-tab flex w-full gap-3 rounded-md rounded-t-none p-4 hover:bg-main-sidebar-background'
                      as={Button}
                      onClick={preventBubbling(pinOpenModal)}
                    >
                      {tweetIsPinned ? (
                        <>
                          <CustomIcon iconName='PinOffIcon' />
                          Unpin from profile
                        </>
                      ) : (
                        <>
                          <CustomIcon iconName='PinIcon' />
                          Pin to your profile
                        </>
                      )}
                    </Popover.Button>
                  ) : userIsFollowed ? (
                    <Popover.Button
                      className='accent-tab flex w-full gap-3 rounded-md rounded-t-none p-4 hover:bg-main-sidebar-background'
                      as={Button}
                      onClick={
                        () => unfollow()
                      }
                    >
                      <HeroIcon iconName='UserMinusIcon' />
                      <Trans>Unfollow</Trans> @{username}
                    </Popover.Button>
                  ) : (
                    <Popover.Button
                      className='accent-tab flex w-full gap-3 rounded-md rounded-t-none p-4 hover:bg-main-sidebar-background'
                      as={Button}
                      onClick={
                        () => follow()
                      }
                    >
                      <HeroIcon iconName='UserPlusIcon' />
                      <Trans>Follow</Trans> @{username}
                    </Popover.Button>
                  )}
                </Popover.Panel>
              )}
            </AnimatePresence>
          </>
        )}
      </Popover>
    </>
  );
}
