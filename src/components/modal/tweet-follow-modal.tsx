import type { TweetProps } from '@components/tweet/tweet';
import React from 'react';
import { HeroIcon } from '@components/ui/hero-icon';
import { Button } from '@components/ui/button';
import { useAuth } from '@lib/context/auth-context';
import cn from 'clsx';
import { FollowButton } from '@components/ui/follow-button';
import { useUser } from '@lib/context/user-context';
import { Profile } from '@lens-protocol/react-web';

type TweetFollowModalProps = {
  tweet: TweetProps;
  closeModal: () => void;
};

export function TweetFollowModal({
  tweet,
  closeModal
}: TweetFollowModalProps): JSX.Element {
  const { profileByMe } = useAuth();
  const { profile: userData } = tweet;

  // const {
  //   execute: follow,
  //   error: followError,
  //   isPending: isFollowPending,
  // } = useFollowWithSelfFundedFallback({
  //   followee: tweet?.profile,
  //   follower: profileByMe,
  // });

  return (
    <>
      <div className='overflow-auto border-[#00000014] p-[20px] text-sm'>
        <div className='space-y-1.5 pb-2'>
          <div className='text-lg font-bold'>
            Super follow&nbsp;
            <span className='text-lg font-bold underline'>
              {userData?.name}
            </span>
          </div>
          <div className='lt-text-gray-500'>
            Follow and get some awesome perks!
          </div>
        </div>
        {/* <div className="flex items-center space-x-1.5 py-2">
              <span className="space-x-1">
                  <span className="text-2xl font-bold">3.0</span>
                  <span className="text-xs">WMATIC</span>
              </span>
          </div> */}
        <div className='flex items-center'>
          <HeroIcon className='mr-[5px] h-4 w-4' iconName='UserIcon' />
          <span>Recipient: {userData?.stats?.totalFollowers}</span>
        </div>
        <div className='mb-[20px] space-y-2 pt-5'>
          <div className='text-lg font-bold'>Perks you get</div>
          <ul className='lt-text-gray-500 space-y-1 text-sm'>
            <li className='flex space-x-2 leading-6 tracking-normal'>
              <div>•</div>
              <div>
                You can comment on {tweet?.profile?.handle} publications
              </div>
            </li>
            <li className='flex space-x-2 leading-6 tracking-normal'>
              <div>•</div>
              <div>You can collect {tweet?.profile?.handle} publications</div>
            </li>
            <li className='flex space-x-2 leading-6 tracking-normal'>
              <div>•</div>
              <div>
                You will get Super follow badge in {tweet?.profile?.handle}{' '}
                profile
              </div>
            </li>
            <li className='flex space-x-2 leading-6 tracking-normal'>
              <div>•</div>
              <div>
                You will have high voting power if you followed multiple times
              </div>
            </li>
            <li className='flex space-x-2 leading-6 tracking-normal'>
              <div>•</div>
              <div>More coming soon™</div>
            </li>
          </ul>
        </div>
        <div className='flex flex-col gap-3 inner:py-2 inner:font-bold'>
          {profileByMe && (
            <FollowButton
              btnClass='w-full'
              userTargetId={userData.id.toString()}
              userTargetUsername={userData.name || ''}
              userIsFollowed={userData.isFollowedByMe}
              followee={userData}
              follower={profileByMe}
            />
          )}
          <Button
            className={cn(
              'w-full border border-light-line-reply hover:bg-light-primary/10 focus-visible:bg-light-primary/10 active:bg-light-primary/20 dark:border-light-secondary dark:text-light-border dark:hover:bg-light-border/10 dark:focus-visible:bg-light-border/10 dark:active:bg-light-border/20'
            )}
            onClick={closeModal}
          >
            Cancel
          </Button>
        </div>
      </div>
    </>
  );
}
