import type { ImagesPreview } from './file';
import type { User } from './user';

export type Tweet = {
  id: string | null;
  user: User ;
  text: string | null;
  images: ImagesPreview | null;
  parent: { id: string; username: string } | null;
  userLikes: number | null;
  createdBy: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  userReplies: number | null;
  userRetweets: number | null;
};

export type TweetWithUser = Tweet & { user: User };

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
