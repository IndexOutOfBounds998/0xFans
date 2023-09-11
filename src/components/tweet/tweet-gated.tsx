import { VideoPreview } from '@components/input/video-preview';
import { ImagePreview } from '@components/input/image-preview';
import { User } from '@lib/types/user';
import { Tweet } from '@lib/types/tweet';
import { Profile, ContentPublication } from '@lens-protocol/react-web';
import { MAIN_NETWORK } from '@lib/const';
import { LensEnvironment, LensGatedSDK } from '@lens-protocol/sdk-gated';
import { HeroIcon } from '@components/ui/hero-icon';
import { Button } from '@components/ui/button';
import cn from 'clsx';
import React, { useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { preventBubbling } from '@lib/utils';
import { ProfileOwnedByMe, useActiveProfile } from '@lens-protocol/react-web';
import { formatImgList, formatVideoList } from '@lib/FormatContent';
import { toast } from 'react-hot-toast';

export type TweetProps = {
  tweet: Tweet;
};

export function TweetGated({ tweet }: TweetProps): JSX.Element {
  const { id: tweetId, publication } = tweet;

  let loading = false;
  const [decrypt, setDecrypt] = useState(false);
  const [text, setText] = useState();
  const [isVideo, setIsVideo] = useState(false);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const { data: profile, error, loading: profileLoading } = useActiveProfile();

  async function decryptMetadata() {
    loading = true;
    const sdk = await LensGatedSDK.create({
      provider: new Web3Provider(window.ethereum),
      signer: new Web3Provider(window.ethereum).getSigner(),
      env: MAIN_NETWORK ? LensEnvironment.Polygon : LensEnvironment.Mumbai
    });

    const profileUser = profile as unknown as ProfileOwnedByMe;

    try {
      await sdk.connect({
        address: profileUser.ownedBy, // your signer's wallet address
        env: MAIN_NETWORK ? LensEnvironment.Polygon : LensEnvironment.Mumbai
      });

      const { error, decrypted } = await sdk.gated.decryptMetadata(
        (publication as ContentPublication).metadata
      );
      if (error) {
        toast.error(error.toString());
      } else {
        const isVideo = decrypted?.mainContentFocus === 'VIDEO';
        setText(decrypted?.content);
        setIsVideo(isVideo);
        setImages(isVideo ? null : formatImgList(decrypted?.media));
        setVideos(isVideo ? formatVideoList(decrypted?.media) : null);
        setDecrypt(true);
      }
    } catch (e) {
      console.log('error decrypting post... ', e);
    }
    debugger;
    loading = false;
  }

  return (
    <div className='h-full w-full'>
      {text && <p className='whitespace-pre-line break-words'>{text}</p>}
      {decrypt ? (
        isVideo ? (
          videos && <VideoPreview tweet videoPreview={videos} />
        ) : (
          images && (
            <ImagePreview
              tweet
              imagesPreview={images}
              previewCount={images?.length}
            />
          )
        )
      ) : (
        <div className='flex h-full w-full flex-col items-center justify-center rounded-2xl bg-main-accent py-[25px] text-white'>
          <HeroIcon
            className='mb-4 h-10 w-10'
            iconName='LockClosedIcon'
            solid
          />
          <Button
            className={cn(
              'w-full border border-light-line-reply hover:bg-light-primary/10 focus-visible:bg-light-primary/10 active:bg-light-primary/20 dark:border-light-secondary dark:text-light-border dark:hover:bg-light-border/10 dark:focus-visible:bg-light-border/10 dark:active:bg-light-border/20'
            )}
            loading={loading}
            onClick={preventBubbling(decryptMetadata)}
          >
            <span className='font-bold'>To view this...</span>
          </Button>
        </div>
      )}
    </div>
  );
}
