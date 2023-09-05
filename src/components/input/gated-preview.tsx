import cn from 'clsx';
import { preventBubbling } from '@lib/utils';
import { AnimatePresence, motion, MotionProps } from 'framer-motion';
import { HeroIcon } from '@components/ui/hero-icon';
import { ContentPublication, usePublication } from '@lens-protocol/react-web';
import { useAuth } from '@lib/context/auth-context';

type GatedPreviewProps = {
  publication: any;
  publicationObj: any;
  openCollectModal?: () => void;
  openFollowModal?: () => void;
};

const variants: MotionProps = {
  initial: { opacity: 0, scale: 0.5 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3 }
  },
  exit: { opacity: 0, scale: 0.5 },
  transition: { type: 'spring', duration: 0.5 }
};

export function GatedPreview({
  publication,
  publicationObj,
  openCollectModal,
  openFollowModal
}: GatedPreviewProps): JSX.Element {
  // const { data: publication, loading: publication_loading } = usePublication(publicationObj);

  const { user } = useAuth();

  const handle = publication?.profile?.handle;

  //null 没有设置超级关注
  const followModule = publication?.profile?.followModule;

  //是否已经被我收藏过
  const collected = (publication as ContentPublication)?.hasCollectedByMe;

  //是否是我自己的帖子
  const isOwer = (publication as ContentPublication)?.profile.id === user?.id;

  const criteria = (publication as ContentPublication)?.metadata
    ?.encryptionParams?.accessCondition?.or?.criteria;

  let isCollect = false;

  let isFollow = false;

  if (criteria) {
    criteria.forEach((item: any) => {
      if (item.follow) {
        //存在单独的follow 则粉丝才能看
        if (!publication?.profile.isFollowedByMe) {
          isFollow = true;
        }
      } else if (item.and) {
        //存在and 则粉丝收藏后付费才能看
        if (!collected) {
          isCollect = true;
        }
      }
    });
  }

  return (
    <div
      className={cn(
        'grid h-[42vw] grid-cols-2 grid-rows-2 gap-3 rounded-2xl xs:h-[37vw] md:h-[271px]'
      )}
    >
      <AnimatePresence mode='popLayout'>
        <motion.button
          type='button'
          className={cn(
            'accent-tab relative col-span-2 row-span-2 rounded-2xl bg-main-background transition-shadow'
          )}
          {...variants}
        >
          {isOwer ? (
            'Decrypt'
          ) : (
            <div className='flex h-full w-full flex-col items-center justify-center rounded-2xl bg-main-accent text-white'>
              <HeroIcon
                className='mb-4 h-10 w-10'
                iconName='LockClosedIcon'
                solid
              />
              <div className='mb-2'>
                <span className='font-bold'>To view this...</span>
              </div>
              {isCollect && (
                <div className='mb-2 flex items-center'>
                  <HeroIcon
                    className='mr-[5px] h-5 w-5'
                    iconName='RectangleStackIcon'
                  />
                  <span>
                    Pay the&nbsp;
                    <span
                      className='font-bold underline'
                      onClick={preventBubbling(openCollectModal)}
                    >
                      post
                    </span>
                  </span>
                </div>
              )}
              {isFollow && (
                <div className='mb-2 flex items-center'>
                  <HeroIcon
                    className='mr-[5px] h-5 w-5'
                    iconName='UserGroupIcon'
                  />
                  <span>
                    Follow&nbsp;
                    <span
                      className='font-bold underline'
                      onClick={preventBubbling(openFollowModal)}
                    >
                      {handle}
                    </span>
                  </span>
                </div>
              )}
            </div>
          )}
        </motion.button>
      </AnimatePresence>
    </div>
  );
}
