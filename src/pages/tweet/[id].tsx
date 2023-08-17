import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { AnimatePresence } from 'framer-motion';
import { doc, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { tweetsCollection } from '@lib/firebase/collections';
import { useCollection } from '@lib/hooks/useCollection';
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
  ReactionType,
  usePublication,
  ContentPublication,
  Post
} from '@lens-protocol/react-web';
import { useAuth } from '@lib/context/auth-context';
import { formatNickName } from '@lib/FormatContent';

export default function TweetId(): JSX.Element {
  const {
    query: { id },
    back
  } = useRouter();

  const { user } = useAuth();
  const { id: observerId } = user;
  // const { data: tweetData, loading: tweetLoading } = useDocument(
  //   doc(tweetsCollection, id as string),
  //   { includeUser: true, allowNull: true }
  // );
  const { data: tweetObj, loading: tweetLoading } = usePublication({
    publicationId: id,
    observerId: observerId
  });

  const initData = (data) => ({
    id: data?.id,
    user: data?.profile,
    text: data?.metadata.content,
    // images: data?.metadata.image,
    images:
      data.metadata.media && data.metadata.media.length
        ? data.metadata.media.map((img, index) => {
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
    createdBy: ' ',
    createdAt: data?.createdAt,
    updatedAt: data?.createdAt,
    userReplies: data?.stats?.totalAmountOfComments,
    userRetweets: data?.stats?.totalAmountOfMirrors,
    ...data
  });

  const initText = (tweetObj) => tweetObj?.text;
  const initImages = (tweetObj) => tweetObj?.images;
  const initImagesLength = (tweetObj) => tweetObj?.images?.length ?? 0;
  const initParentId = (tweetObj) => tweetObj?.parent?.id;

  const viewTweetRef = useRef<HTMLElement>(null);

  const {
    data: repliesData,
    loading: repliesLoading,
    hasMore,
    next
  } = useComments({
    commentsOf: id,
    limit: 10,
    observerId: observerId
  });

  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    if (repliesData) {
      console.log(repliesData);
      let list = [];
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
        title={initParentId(tweetObj) ? 'Thread' : 'Tweet'}
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
            {initParentId(tweetObj) && (
              <ViewParentTweet
                parentId={initParentId(tweetObj)}
                viewTweetRef={viewTweetRef}
              />
            )}
            <ViewTweet viewTweetRef={viewTweetRef} {...initData(tweetObj)} />
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
