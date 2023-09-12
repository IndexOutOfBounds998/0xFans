import { useEffect, Fragment, useState } from 'react';
import TextArea from 'react-textarea-autosize';
import { motion } from 'framer-motion';
import { useModal } from '@lib/hooks/useModal';
import { Modal } from '@components/modal/modal';
import { ActionModal } from '@components/modal/action-modal';
import { HeroIcon } from '@components/ui/hero-icon';
import { Button } from '@components/ui/button';
import type {
  ReactNode,
  RefObject,
  ChangeEvent,
  KeyboardEvent,
  ClipboardEvent
} from 'react';
import type { Variants } from 'framer-motion';
import { Menu, Popover } from '@headlessui/react';
import type { IconName } from '@components/ui/hero-icon';
import { Trans, t } from '@lingui/macro';
type AudienceType = {
  icon: IconName;
  label: string;
  color: string;
};

type InputFormProps = {
  modal?: boolean;
  formId: string;
  loading: boolean;
  visited: boolean;
  reply?: boolean;
  children: ReactNode;
  inputRef: RefObject<HTMLTextAreaElement>;
  inputValue: string;
  replyModal?: boolean;
  isValidTweet: boolean;
  isUploadingImages: boolean;
  audience: AudienceType;
  setAudience: (val: AudienceType) => void;
  sendTweet: () => Promise<void>;
  handleFocus: () => void;
  discardTweet: () => void;
  handleChange: ({
    target: { value }
  }: ChangeEvent<HTMLTextAreaElement>) => void;
  handleImageUpload: (
    e: ChangeEvent<HTMLInputElement> | ClipboardEvent<HTMLTextAreaElement>
  ) => void;
};

const variants: Variants[] = [
  {
    initial: { y: -25, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { type: 'spring' } }
  },
  {
    initial: { x: 25, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { type: 'spring' } }
  }
];

export const [fromTop, fromBottom] = variants;

export function InputForm({
  modal,
  reply,
  formId,
  loading,
  visited,
  children,
  inputRef,
  replyModal,
  inputValue,
  isValidTweet,
  isUploadingImages,
  sendTweet,
  handleFocus,
  discardTweet,
  handleChange,
  handleImageUpload,
  audience,
  setAudience
}: InputFormProps): JSX.Element {
  const { open, openModal, closeModal } = useModal();


  const [peopler] = useState<AudienceType[]>([
    { icon: 'GlobeAsiaAustraliaIcon', label: t`Everyone`, color: '#1d9bf0' },
    { icon: 'UserGroupIcon', label: t`Onlyfans`, color: '#00ba7c' }
  ])

  useEffect(() => {
    handleShowHideNav(true);
    setAudience(peopler[0]);
  }, []);

  const handleKeyboardShortcut = ({
    key,
    ctrlKey
  }: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (!modal && key === 'Escape')
      if (isValidTweet) {
        inputRef.current?.blur();
        openModal();
      } else discardTweet();
    else if (ctrlKey && key === 'Enter' && isValidTweet) void sendTweet();
  };

  const handleShowHideNav = (blur?: boolean) => (): void => {
    const sidebar = document.getElementById('sidebar') as HTMLElement;

    if (!sidebar) return;

    if (blur) {
      setTimeout(() => (sidebar.style.opacity = ''), 200);
      return;
    }

    if (window.innerWidth < 500) sidebar.style.opacity = '0';
  };

  const handleFormFocus = (): void => {
    handleShowHideNav()();
    handleFocus();
  };

  const handleClose = (): void => {
    discardTweet();
    closeModal();
  };

  const isVisibilityShown = visited && !reply && !replyModal && !loading;

  return (
    <div className='flex min-h-[48px] w-full flex-col justify-center gap-4'>
      <Modal
        modalClassName='max-w-xs bg-main-background w-full p-8 rounded-2xl'
        open={open}
        closeModal={closeModal}
      >
        <ActionModal
          title='Discard Posts?'
          description='This can’t be undone and you’ll lose your draft.'
          mainBtnClassName='bg-accent-red hover:bg-accent-red/90 active:bg-accent-red/75'
          mainBtnLabel='Discard'
          action={handleClose}
          closeModal={closeModal}
        />
      </Modal>
      <div className='relative flex flex-col gap-6'>
        {isVisibilityShown && (
          <>
            <Popover>
              <Popover.Button
                className='custom-button accent-tab accent-bg-tab flex items-center gap-1
                       self-start border border-light-line-reply py-0 px-3 text-main-accent
                       hover:bg-main-accent/10 active:bg-main-accent/20 dark:border-light-secondary'
              >
                <p className='font-bold'>{audience.label}</p>
                <HeroIcon className='h-4 w-4' iconName='ChevronDownIcon' />
              </Popover.Button>

              <Popover.Panel className='menu-container absolute left-[-70px] top-[35px] z-10'>
                <div className='h-[190px] w-[260px] rounded-2xl bg-main-background py-[10px] shadow-inner'>
                  <p className='px-[15px] text-[20px] font-bold'>
                    <Trans>Choose audience</Trans>
                  </p>
                  {peopler.map((item) => (
                    <div
                      className='flex cursor-pointer items-center px-[15px] py-[15px] hover:bg-main-accent/20'
                      onClick={() => setAudience(item)}
                    >
                      <div
                        className='mr-[12px] flex h-[40px] w-[40px] items-center justify-center rounded-3xl'
                        style={{ background: item.color }}
                      >
                        <HeroIcon
                          solid
                          className='h-[20px] w-[20px] text-[#fff]'
                          iconName={item.icon}
                        />
                      </div>
                      <div className='flex w-[calc(100%-52px)] items-center justify-between'>
                        <span className='font-bold'>{item.label}</span>
                        {item.label === audience.label ? (
                          <div>
                            <HeroIcon
                              className='h-[18px] w-[20px] text-main-accent'
                              iconName='CheckIcon'
                            />
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Popover.Panel>
            </Popover>
          </>
          // <motion.button
          //   type='button'
          //   className='custom-button accent-tab accent-bg-tab flex cursor-not-allowed items-center gap-1
          //              self-start border border-light-line-reply py-0 px-3 text-main-accent
          //              hover:bg-main-accent/10 active:bg-main-accent/20 dark:border-light-secondary'
          //   {...fromTop}
          // >
          //   <p className='font-bold'>Everyone</p>
          //
          //   <HeroIcon className='h-4 w-4' iconName='ChevronDownIcon' />
          // </motion.button>
        )}
        <div className='flex items-center gap-3'>
          <TextArea
            id={formId}
            className='w-full min-w-0 resize-none bg-transparent text-xl outline-none
                       placeholder:text-light-secondary dark:placeholder:text-dark-secondary'
            value={inputValue}
            placeholder={
              reply || replyModal ? 'Post your reply' : "What's happening?"
            }
            onBlur={handleShowHideNav(true)}
            minRows={loading ? 1 : modal && !isUploadingImages ? 3 : 1}
            maxRows={isUploadingImages ? 5 : 15}
            onFocus={handleFormFocus}
            onPaste={handleImageUpload}
            onKeyUp={handleKeyboardShortcut}
            onChange={handleChange}
            ref={inputRef}
          />
          {reply && !visited && (
            <Button
              className='cursor-pointer bg-main-accent px-4 py-1.5 font-bold text-white opacity-50'
              onClick={handleFocus}
            >
              <Trans>Reply</Trans>
            </Button>
          )}
        </div>
      </div>
      {children}
      {isVisibilityShown && (
        <motion.div
          className='flex border-b border-light-border pb-2 dark:border-dark-border'
          {...fromBottom}
        >
          <button
            type='button'
            className='custom-button accent-tab accent-bg-tab flex cursor-not-allowed items-center gap-1 py-0
                       px-3 text-main-accent hover:bg-main-accent/10 active:bg-main-accent/20'
          >
            <HeroIcon className='h-4 w-4' iconName={audience.icon} />
            <p className='font-bold'>{audience.label} <Trans>can reply</Trans></p>
          </button>
        </motion.div>
      )}
    </div>
  );
}
