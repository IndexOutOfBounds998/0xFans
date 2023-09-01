import cn from 'clsx';
import { preventBubbling } from '@lib/utils';
import { AnimatePresence, motion, MotionProps } from 'framer-motion';
import { HeroIcon } from '@components/ui/hero-icon';
import { ContentPublication, usePublication } from '@lens-protocol/react-web';

type GatedPreviewProps = {
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
  publicationObj,
  openCollectModal,
  openFollowModal
}: GatedPreviewProps): JSX.Element {
  const { data: publication, loading: publication_loading } = usePublication(publicationObj);

  const handle = publication?.profile?.handle;

  const collected = (publication as ContentPublication)?.hasCollectedByMe;

  const criteria = (publication as ContentPublication)?.metadata?.encryptionParams?.accessCondition?.or?.criteria;
  let isProfile;
  let isFollow;
  console.log(criteria);
  if (criteria) {
    criteria.forEach((item: any) => {
      if (item.profile) {
        if (!collected) {
          isProfile = true;
        }
      } else if (item.follow) {
        if (!publication?.profile.isFollowedByMe) {
          isFollow = true;
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
          <div className='flex h-full w-full flex-col items-center justify-center rounded-2xl bg-main-accent text-white'>
            <HeroIcon
              className='mb-4 h-10 w-10'
              iconName='LockClosedIcon'
              solid
            />
            <div className='mb-2'>
              <span className='font-bold'>To view this...</span>
            </div>
            {isProfile && (
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
        </motion.button>
      </AnimatePresence>
    </div>
  );
}
