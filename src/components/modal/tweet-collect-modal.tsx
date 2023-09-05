import { Input } from '@components/input/input';
import { Tweet } from '@components/tweet/tweet';
import type { TweetProps } from '@components/tweet/tweet';
import React from 'react';
import { HeroIcon } from '@components/ui/hero-icon';
import { Button } from '@components/ui/button';
import cn from 'clsx';
import {
  ContentPublication,
  SimpleCollectModuleSettings
} from '@lens-protocol/react-web';
import { useAuth } from '@lib/context/auth-context';
import CollectButton from '@components/ui/collect-button';

type TweetCollectModalProps = {
  publication: ContentPublication;
  closeModal: () => void;
};

export function TweetCollectModal({
  publication,
  closeModal
}: TweetCollectModalProps): JSX.Element {
  const { profileByMe } = useAuth();
  const creater = publication.profile.handle;

  const content = publication.metadata.content;

  const feeOptional = (publication.collectModule as SimpleCollectModuleSettings)
    ?.feeOptional;

  const followerOnly = (
    publication.collectModule as SimpleCollectModuleSettings
  )?.followerOnly;
  return (
    <>
      <div className='overflow-auto border-t-[1px] border-[#00000014] p-[20px] text-sm'>
        <div className='space-y-1.5 pb-2'>
          <div className='text-xl font-bold'>Post by @{creater}</div>
          <div className='lt-text-gray-500 line-clamp-2'>
            <p>{content}</p>
          </div>
        </div>
        {followerOnly ? (
          <div className='flex items-center space-x-1.5 rounded-none border border-x-0 border-pink-300 bg-white !bg-pink-100 px-[5px] py-[10px] text-sm font-bold text-gray-500 dark:border-gray-700 dark:bg-black sm:rounded-xl sm:border-x'>
            <HeroIcon iconName='StarIcon' className='h-4 w-4 text-pink-500' />
            <span className='ml-[5px]'>Only</span>
            <span className='text-purple-500'>{creater}</span>
            <span className='text-pink-500'>super followers</span>
            <span>can collect</span>
          </div>
        ) : (
          ''
        )}
        {feeOptional ? (
          <div className='flex items-center space-x-1.5 py-2'>
            <img
              className='h-7 w-7'
              height='28'
              width='28'
              src={`https://static-assets.lenster.xyz/images/tokens/${feeOptional.amount.asset.symbol.toLocaleLowerCase()}.svg`}
              alt={feeOptional.amount.asset.symbol}
              title={feeOptional.amount.asset.symbol}
            />
            <span className='space-x-1'>
              <span className='text-2xl font-bold'>
                {feeOptional.amount.value}
              </span>
              <span className='text-xs'>{feeOptional.amount.asset.name}</span>
              {/* <span className="lt-text-gray-500 px-0.5">·</span>
            <span className="lt-text-gray-500 text-xs font-bold">$1.00</span> */}
            </span>
          </div>
        ) : (
          ''
        )}

        <div className='mb-[20px] space-y-1.5'>
          <div className='block items-center space-y-1 sm:flex sm:space-x-5'>
            <div className='flex items-center space-x-2'>
              <HeroIcon className='h-4 w-4' iconName='UsersIcon' />
              <button className='font-bold' type='button'>
                {publication.stats.totalAmountOfCollects} collectors
              </button>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-3 inner:py-2 inner:font-bold'>
          <CollectButton
            btnClass='w-full'
            collector={profileByMe}
            publication={publication as ContentPublication}
          />
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
