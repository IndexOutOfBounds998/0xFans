import Link from 'next/link';
import { useState, useEffect, useRef, useId } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import cn from 'clsx';
import { toast } from 'react-hot-toast';
import { useAuth } from '@lib/context/auth-context';
import { getImagesData } from '@lib/validation';
import { UserAvatar } from '@components/user/user-avatar';
import { InputForm, fromTop } from './input-form';
import { ImagePreview } from './image-preview';
import { InputOptions } from './input-options';
import type { ReactNode, FormEvent, ChangeEvent, ClipboardEvent } from 'react';
import type { Variants } from 'framer-motion';
import type { User } from '@lib/types/user';
import type {
  FilesWithId,
  ImagesPreview,
  ImageData,
  VideosPreview
} from '@lib/types/file';
import { useSendComment } from '@lib/hooks/useSendComment';
import { usePost } from '@lib/hooks/usePost';
import { Profile } from '@lens-protocol/react-web';
import { formatAvater } from '@lib/FormatContent';
import type { IconName } from '@components/ui/hero-icon';
import { getRandomId } from '@lib/random';
import { VideoPreview } from '@components/input/video-preview';

type AudienceType = {
  id: string;
  icon: IconName;
  label: string;
  color: string;
};

type InputProps = {
  modal?: boolean;
  reply?: boolean;
  parent?: { id: string; username: string };
  disabled?: boolean;
  children?: ReactNode;
  replyModal?: boolean;
  closeModal?: () => void;
};

export const variants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 }
};

export function Input({
  modal,
  reply,
  parent,
  disabled,
  children,
  replyModal,
  closeModal
}: InputProps): JSX.Element {
  const [selectedImages, setSelectedImages] = useState<FilesWithId>([]);
  const [imagesPreview, setImagesPreview] = useState<ImagesPreview>([]);
  const [videoPreview, setVideoPreview] = useState<VideosPreview>([]);
  const [selectedVideo, setSelectedVideo] = useState<FilesWithId>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [visited, setVisited] = useState(false);
  const [collectData, setCollectData] = useState({});
  const [audience, setAudience] = useState<AudienceType>({
    id: 'Everyone',
    icon: 'GlobeAsiaAustraliaIcon',
    label: 'Everyone',
    color: '#1d9bf0'
  });

  const { user, profileByMe } = useAuth();
  const { name, username, photoURL } = user as User;

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const previewCount = imagesPreview.length;
  const isUploadingImages = !!previewCount;

  const videoPreviewCount = videoPreview.length;
  const isUploadingVideo = !!videoPreviewCount;

  //发布评论
  const { submit: send, loading: sendLoad } = useSendComment({
    publication: parent
  });

  const callbackOnError = (error: any) => {
    // alert('发布失败' + error);
    toast.error('发布失败' + error);
  };
  const profileUser = profileByMe as unknown as Profile;
  //发布帖子
  const { submit: post, postLoading } = usePost({
    callbackOnError: callbackOnError
  });

  useEffect(
    () => {
      if (modal) inputRef.current?.focus();
      return cleanUrl;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const sendTweet = async (): Promise<void> => {
    inputRef.current?.blur();

    setLoading(true);

    const isReplying = reply ?? replyModal;

    const userId = user?.id as string;

    if (inputValue.trim()) {
      const profileUser = user as unknown as Profile;

      const content = inputValue.trim();
      if (isReplying) await Promise.all([send(content, profileUser)]);
      else {
        await Promise.all([
          post({
            images: selectedImages,
            video: selectedVideo,
            title: '',
            content: content,
            collectData: collectData,
            isOnlyfans: audience.id === 'Onlyfans'
          })
        ]);
      }
    }

    if (!modal && !replyModal) {
      discardTweet();
      setLoading(false);
    }

    if (closeModal) closeModal();

    // const { id: tweetId } = await getDoc(tweetRef);

    toast.success(
      () => (
        <span className='flex gap-2'>
          Your Posts was sent success
          {/*<Link href={`/publication/${tweetId}`}>*/}
          {/* <span className='custom-underline font-bold'>View</span> */}
          {/*</Link>*/}
        </span>
      ),
      { duration: 6000 }
    );
  };

  const handleImageUpload = (
    e: ChangeEvent<HTMLInputElement> | ClipboardEvent<HTMLTextAreaElement>
  ): void => {
    const isClipboardEvent = 'clipboardData' in e;

    if (isClipboardEvent) {
      const isPastingText = e.clipboardData.getData('text');
      if (isPastingText) return;
    }

    const files = isClipboardEvent ? e.clipboardData.files : e.target.files;

    const imagesData = getImagesData(files, previewCount);

    if (!imagesData) {
      toast.error('Please choose a GIF or photo up to 4');
      return;
    }
    setVideoPreview([]);
    setSelectedVideo([]);
    const { imagesPreviewData, selectedImagesData } = imagesData;

    setImagesPreview([...imagesPreview, ...imagesPreviewData]);
    setSelectedImages([...selectedImages, ...selectedImagesData]);

    inputRef.current?.focus();
  };

  const handleVideoUpload = (
    e: ChangeEvent<HTMLInputElement> | ClipboardEvent<HTMLTextAreaElement>
  ): void => {
    const isClipboardEvent = 'clipboardData' in e;

    if (isClipboardEvent) {
      const isPastingText = e.clipboardData.getData('text');
      if (isPastingText) return;
    }

    const files = isClipboardEvent ? e.clipboardData.files : e.target.files;

    if (files?.length === 1) {
      setSelectedImages([]);
      setImagesPreview([]);
      const randomId = getRandomId();
      const localStream = window.URL.createObjectURL(files[0]);
      setVideoPreview([{ url: localStream, id: randomId, cover: '', alt: '' }]);
      setSelectedVideo([Object.assign(files[0], { id: randomId })]);
    } else {
      toast.error('Please choose video up to 1');
      return;
    }

    inputRef.current?.focus();
  };

  const removeImage = (targetId: string) => (): void => {
    setSelectedImages(selectedImages.filter(({ id }) => id !== targetId));
    setImagesPreview(imagesPreview.filter(({ id }) => id !== targetId));

    // const { src } = imagesPreview.find(
    //   ({ id }) => id === targetId
    // ) as ImageData;
    //
    // URL.revokeObjectURL(src);
  };

  const removeVideo = (targetId: string) => (): void => {
    setVideoPreview(videoPreview.filter(({ id }) => id !== targetId));
    setSelectedVideo(selectedVideo.filter(({ id }) => id !== targetId));

    // const { src } = videoPreview.find(
    //     ({ id }) => id === targetId
    // ) as ImageData;
    //
    // URL.revokeObjectURL(src);
  };

  const cleanUrl = (): void => {
    imagesPreview.forEach(({ src }) => URL.revokeObjectURL(src));
    videoPreview.forEach(({ url }) => URL.revokeObjectURL(url));

    setVideoPreview([]);
    setSelectedVideo([]);
    setSelectedImages([]);
    setImagesPreview([]);
  };

  const discardTweet = (): void => {
    setInputValue('');
    setVisited(false);
    cleanUrl();

    inputRef.current?.blur();
  };

  const handleChange = ({
    target: { value }
  }: ChangeEvent<HTMLTextAreaElement>): void => setInputValue(value);

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    void sendTweet();
  };

  const handleFocus = (): void => setVisited(!loading);

  const formId = useId();

  const inputLimit = 280;

  const inputLength = inputValue.length;
  const isValidInput = !!inputValue.trim().length;
  const isCharLimitExceeded = inputLength > inputLimit;

  const isValidTweet =
    !isCharLimitExceeded && (isValidInput || isUploadingImages);

  return (
    <form
      className={cn('flex flex-col', {
        '-mx-4': reply,
        'gap-2': replyModal,
        'cursor-not-allowed': disabled
      })}
      onSubmit={handleSubmit}
    >
      {loading && (
        <motion.i className='h-1 animate-pulse bg-main-accent' {...variants} />
      )}
      {children}
      {reply && visited && (
        <motion.p
          className='ml-[75px] -mb-2 mt-2 text-light-secondary dark:text-dark-secondary'
          {...fromTop}
        >
          Replying to {/*<Link href={`/user/${parent?.username as string}`}>*/}
          <span className='custom-underline text-main-accent'>
            {parent?.username as string}
          </span>
          {/*</Link>*/}
        </motion.p>
      )}
      <label
        className={cn(
          'hover-animation grid w-full grid-cols-[auto,1fr] gap-3 px-4 py-3',
          reply
            ? 'pt-3 pb-1'
            : replyModal
            ? 'pt-0'
            : 'border-b-2 border-light-border dark:border-dark-border',
          (disabled || loading) && 'pointer-events-none opacity-50'
        )}
        htmlFor={formId}
      >
        <UserAvatar
          src={formatAvater(photoURL)}
          alt={name ? name : ''}
          username={name ? name : ''}
        />
        <div className='flex w-full flex-col gap-4'>
          <InputForm
            modal={modal}
            reply={reply}
            formId={formId}
            visited={visited}
            loading={loading}
            inputRef={inputRef}
            replyModal={replyModal}
            inputValue={inputValue}
            isValidTweet={isValidTweet}
            isUploadingImages={isUploadingImages}
            audience={audience}
            setAudience={(val: AudienceType) => setAudience(val)}
            sendTweet={sendTweet}
            handleFocus={handleFocus}
            discardTweet={discardTweet}
            handleChange={handleChange}
            handleImageUpload={handleImageUpload}
          >
            {
              isUploadingVideo
                ? videoPreview && (
                    <VideoPreview
                      removeImage={!loading ? removeVideo : undefined}
                      tweet
                      videoPreview={videoPreview}
                    />
                  )
                : isUploadingImages && (
                    <ImagePreview
                      imagesPreview={imagesPreview}
                      previewCount={previewCount}
                      removeImage={!loading ? removeImage : undefined}
                    />
                  )
              // isUploadingImages && (
              // <ImagePreview
              // imagesPreview={imagesPreview}
              // previewCount={previewCount}
              // removeImage={!loading ? removeImage : undefined}
              // />
              // )
            }
          </InputForm>
          <AnimatePresence initial={false}>
            {(reply ? reply && visited && !loading : !loading) && (
              <InputOptions
                reply={reply}
                modal={modal}
                inputLimit={inputLimit}
                inputLength={inputLength}
                isValidTweet={isValidTweet}
                isCharLimitExceeded={isCharLimitExceeded}
                audience={audience}
                handleImageUpload={handleImageUpload}
                handleVideoUpload={handleVideoUpload}
                collectData={collectData}
                setCollectData={setCollectData}
              />
            )}
          </AnimatePresence>
        </div>
      </label>
    </form>
  );
}
