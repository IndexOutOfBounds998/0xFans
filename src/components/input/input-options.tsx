import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@components/ui/button';
import { HeroIcon } from '@components/ui/hero-icon';
import { ToolTip } from '@components/ui/tooltip';
import { variants } from './input';
import { ProgressBar } from './progress-bar';
import type { ChangeEvent, ClipboardEvent } from 'react';
import type { IconName } from '@components/ui/hero-icon';
import { Modal } from '@components/modal/modal';
import CollectSetting from '@components/collect/collect-setting';
import { useModal } from '@lib/hooks/useModal';
import { useLingui } from '@lingui/react';
import { Trans, t } from '@lingui/macro';
type Options = {
  name: string;
  iconName: IconName;
  disabled: boolean;
  tip?: string;
  onClick?: () => void;
}[];

type AudienceType = {
  icon: IconName;
  label: string;
  color: string;
};

type InputOptionsProps = {
  reply?: boolean;
  modal?: boolean;
  inputLimit: number;
  inputLength: number;
  isValidTweet: boolean;
  isCharLimitExceeded: boolean;
  audience: AudienceType;
  handleImageUpload: (
    e: ChangeEvent<HTMLInputElement> | ClipboardEvent<HTMLTextAreaElement>
  ) => void;
  collectData: any;
  setCollectData?: (obj: any) => void;
};

export function InputOptions({
  reply,
  modal,
  inputLimit,
  inputLength,
  isValidTweet,
  isCharLimitExceeded,
  handleImageUpload,
  collectData,
  setCollectData,
  audience
}: InputOptionsProps): JSX.Element {
  useLingui();
  const { open, openModal, closeModal } = useModal();

  const mediaClick = (): void => inputFileRef.current?.click();

  const options: Readonly<Options> = [
    {
      name: t`Media`,
      iconName: 'PhotoIcon',
      disabled: false,
      onClick: mediaClick
    },
    {
      name: t`GIF`,
      iconName: 'GifIcon',
      disabled: true
    },
    {
      name: t`Emoji`,
      iconName: 'FaceSmileIcon',
      disabled: true
    },
    {
      name: t`Collect`,
      iconName: 'RectangleStackIcon',
      disabled: audience.label === 'Everyone',
      tip: t`onlyfans can use`,
      onClick: openModal
    },
    {
      name: t`Location`,
      iconName: 'MapPinIcon',
      disabled: true
    }
  ];

  const inputFileRef = useRef<HTMLInputElement>(null);

  let filteredOptions = options;

  if (reply)
    filteredOptions = filteredOptions.filter(
      (_, index) => ![2, 4].includes(index)
    );

  return (
    <motion.div className='flex justify-between' {...variants}>
      <Modal
        className='flex items-start justify-center'
        modalClassName='bg-main-background rounded-2xl max-w-xl w-full mt-8 overflow-hidden'
        open={open}
        closeModal={closeModal}
      >
        <CollectSetting
          closeModal={closeModal}
          collectData={collectData}
          setCollectData={setCollectData || (() => { })}
        />
      </Modal>
      <div
        className='flex text-main-accent xs:[&>button:nth-child(n+6)]:hidden
                   md:[&>button]:!block [&>button:nth-child(n+4)]:hidden'
      >
        <input
          className='hidden'
          type='file'
          accept='image/*'
          onChange={handleImageUpload}
          ref={inputFileRef}
          multiple
        />
        {filteredOptions.map(
          ({ name, iconName, disabled, onClick, tip }, index) => (
            <Button
              className='accent-tab accent-bg-tab group relative rounded-full p-2
                       hover:bg-main-accent/10 active:bg-main-accent/20'
              onClick={onClick}
              disabled={disabled}
              key={name}
            >
              <HeroIcon className='h-5 w-5' iconName={iconName} />
              <ToolTip tip={tip || name} modal={modal} />
            </Button>
          )
        )}
      </div>
      <div className='flex items-center gap-4'>
        <motion.div
          className='flex items-center gap-4'
          animate={
            inputLength ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }
          }
        >
          <ProgressBar
            modal={modal}
            inputLimit={inputLimit}
            inputLength={inputLength}
            isCharLimitExceeded={isCharLimitExceeded}
          />
          {!reply && (
            <>
              <i className='hidden h-8 w-[1px] bg-[#B9CAD3] dark:bg-[#3E4144] xs:block' />
              <Button
                className='group relative hidden rounded-full border border-light-line-reply p-[1px]
                           text-main-accent dark:border-light-secondary xs:block'
                disabled
              >
                <HeroIcon className='h-5 w-5' iconName='PlusIcon' />
                <ToolTip tip={t`Add`} modal={modal} />
              </Button>
            </>
          )}
        </motion.div>
        <Button
          type='submit'
          className='accent-tab bg-main-accent px-4 py-1.5 font-bold text-white
                     enabled:hover:bg-main-accent/90
                     enabled:active:bg-main-accent/75'
          disabled={!isValidTweet}
        >
          {reply ? t`Reply` : t`Post`}
        </Button>
      </div>
    </motion.div>
  );
}
