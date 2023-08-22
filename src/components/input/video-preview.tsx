import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import cn from 'clsx';
import { useModal } from '@lib/hooks/useModal';
import { preventBubbling } from '@lib/utils';
import { ImageModal } from '@components/modal/image-modal';
import { Modal } from '@components/modal/modal';
import { NextImage } from '@components/ui/next-image';
import { ReactVideo } from '@components/ui/react-video';
import { Button } from '@components/ui/button';
import { HeroIcon } from '@components/ui/hero-icon';
import { ToolTip } from '@components/ui/tooltip';
import type { MotionProps } from 'framer-motion';
import type { ImagesPreview, ImageData, VideosPreview } from '@lib/types/file';

type ImagePreviewProps = {
  tweet?: boolean;
  viewTweet?: boolean;
  videoPreview?: VideosPreview;
  removeImage?: (targetId: string) => () => void;
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

type PostImageBorderRadius = Record<number, string[]>;

export function VideoPreview({
  tweet,
  viewTweet,
  videoPreview,
  removeImage
}: ImagePreviewProps): JSX.Element {
  const isTweet = tweet ?? viewTweet;
  const { url, cover, id }: any = videoPreview ? videoPreview[0] : {};

  return (
    <div
      className={cn(
        'grid grid-cols-2 grid-rows-2 rounded-2xl',
        viewTweet
          ? 'h-[51vw] xs:h-[42vw] md:h-[305px]'
          : 'h-[42vw] xs:h-[37vw] md:h-[271px]',
        isTweet ? 'mt-2 gap-0.5' : 'gap-3'
      )}
    >
      <AnimatePresence mode='popLayout'>
        <motion.button
          type='button'
          className={cn(
            'accent-tab relative col-span-2 row-span-2 rounded-2xl transition-shadow'
          )}
          {...variants}
          onClick={preventBubbling()}
          layout={!isTweet ? true : false}
        >
          <ReactVideo url={url} light={cover} width={'100%'} height={'100%'} />
          {removeImage && (
            <Button
              className='group absolute top-0 left-0 translate-x-1 translate-y-1
                           bg-light-primary/75 p-1 backdrop-blur-sm
                           hover:bg-image-preview-hover/75'
              onClick={preventBubbling(removeImage(id))}
            >
              <HeroIcon className='h-5 w-5 text-white' iconName='XMarkIcon' />
              <ToolTip className='translate-y-2' tip='Remove' />
            </Button>
          )}
        </motion.button>
      </AnimatePresence>
    </div>
  );
}
