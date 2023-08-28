import { UserCardProps } from '@lib/hooks/useCollection';
import type { ImagesPreview, VideosPreview } from './file';
import type { User } from './user';
import { Profile } from '@lens-protocol/react-web';

export type Tweet = {
  id: string | null;
  user: User;
  text: string | null;
  isVideo: boolean;
  images: ImagesPreview | null;
  videos: VideosPreview | null;
  parent: { id: string; username: string } | null;
  userLikes: number | null;
  createdBy: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  userReplies: number | null;
  userRetweets: number | null;
  profile: Profile;
};

export type TweetWithUser = Tweet & { user: UserCardProps };

// export const tweetConverter: FirestoreDataConverter<Tweet> = {
//   toFirestore(tweet) {
//     return { ...tweet };
//   },
//   fromFirestore(snapshot, options) {
//     const { id } = snapshot;
//     const data = snapshot.data(options);

//     return { id, ...data } as Tweet;
//   }
// };
