import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { AnimatePresence } from 'framer-motion';
import { HomeLayout, ProtectedLayout } from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import { MainContainer } from '@components/home/main-container';
import { MainHeader } from '@components/home/main-header';
import { Tweet } from '@components/tweet/tweet';
import { ViewTweet } from '@components/view/view-tweet';
import { SEO } from '@components/common/seo';
import { Loading } from '@components/ui/loading';
import { Error } from '@components/ui/error';
import { ViewParentTweet } from '@components/view/view-parent-tweet';
import type { ReactElement, ReactNode } from 'react';
import {
  useComments,
  usePublication,
  Comment
} from '@lens-protocol/react-web';
import { useAuth } from '@lib/context/auth-context';
import { formatNickName } from '@lib/FormatContent';
import { Tweet as Tw } from '@lib/types/tweet';
import { Timestamp } from 'firebase/firestore';

type TwDetailsProps = Pick<
  Tw,
  | 'id'
  | 'text'
  | 'images'
  | 'parent'
  | 'userReplies'
  | 'user'
  | 'createdBy'
  | 'userLikes'
  | 'createdAt'
  | 'updatedAt'
  | 'userRetweets'
>;
export default function TweetId(): JSX.Element {
  const {
    query: { id },
    back
  } = useRouter();

  const { user } = useAuth();

  const { data: tweetObj, loading: tweetLoading } = usePublication({
    publicationId: id,
    observerId: user?.id
  });

  const initData = (data: Comment) => {
    const initData: TwDetailsProps = {
      user: data?.profile,
      text: data?.metadata.content,
      images: data?.metadata.media && data?.metadata.media.length
        ? data?.metadata.media.map((img, index) => {
          return {
            id: index.toString(),
            src: img.original.url,
            alt: img.original.altTag ? img.original.altTag : ''
          };
        })
        : null,
      parent: {
        id: data?.profile?.id,
        username: formatNickName(data?.profile?.handle)
      },
      id: data.id,
      createdBy: data.profile.name,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      userReplies: data?.stats?.totalAmountOfComments,
      userRetweets: data?.stats?.totalAmountOfMirrors,
      userLikes: data?.stats?.totalUpvotes
    };


    return initData;
  };

  // const initText = (tweetObj:Post) => tweetObj?.metadata.content;
  // const initImages = (tweetObj:AnyPublication) => tweetObj?.images;
  // const initImagesLength = (tweetObj:AnyPublication) => tweetObj?.images?.length ?? 0;
  const initParentId = (tweetObj: Comment) => tweetObj?.commentOn?.id.toString();

  const viewTweetRef = useRef<HTMLElement>(null);

  const {
    data: repliesData,
    loading: repliesLoading,
    hasMore,
    next
  } = useComments({
    commentsOf: id,
    limit: 10,
    observerId: user?.id
  });

  const [commentList, setCommentList] = useState<TwDetailsProps[]>([]);

  useEffect(() => {
    if (repliesData) {
      console.log(repliesData);
      let list: TwDetailsProps[] = [];
      repliesData.forEach((item) => {
        list.push(initData(item));
      });
      setCommentList(list);
      // let list;
      // repliesData.
    }
  }, repliesData);

  // const { text, images } = tweetData ?? {};

  // const imagesLength = images?.length ?? 0;
  // const parentId = tweetData?.parent?.id;

  // const pageTitle = tweetData
  //   ? `${tweetData.user.name} on Twitter: "${text ?? ''}${
  //       images ? ` (${imagesLength} image${isPlural(imagesLength)})` : ''
  //     }" / Twitter`
  //   : null;
  const pageTitle = null;

  return (
    <MainContainer className='!pb-[1280px]'>
      <MainHeader
        useActionButton
        title={initParentId(tweetObj as Comment) ? 'Thread' : 'Tweet'}
        action={back}
      />
      <section>
        {tweetLoading ? (
          <Loading className='mt-5' />
        ) : !tweetObj ? (
          <>
            <SEO title='Tweet not found / Twitter' />
            <Error message='Tweet not found' />
          </>
        ) : (
          <>
            {pageTitle && <SEO title={pageTitle} />}
            {initParentId(tweetObj as Comment) && (
              <ViewParentTweet
                parentId={initParentId(tweetObj as Comment) ?? ''}
                viewTweetRef={viewTweetRef}
              />
            )}
            <ViewTweet viewTweetRef={viewTweetRef} {...initData(tweetObj as Comment)} />
            {tweetObj &&
              (repliesLoading ? (
                <Loading className='mt-5' />
              ) : (
                <AnimatePresence mode='popLayout'>
                  {commentList?.map((tweet) => (
                    <Tweet {...tweet} key={tweet.id} />
                  ))}
                </AnimatePresence>
              ))}
          </>
        )}
      </section>
    </MainContainer>
  );
}

TweetId.getLayout = (page: ReactElement): ReactNode => (
  <ProtectedLayout>
    <MainLayout>
      <HomeLayout>{page}</HomeLayout>
    </MainLayout>
  </ProtectedLayout>
);
