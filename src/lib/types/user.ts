
import type { Theme, Accent } from './theme';

export type User = {
  id: String;
  bio: string | null;
  name: string | null;
  theme: Theme | null;
  accent: Accent | null;
  website: string | null;
  location: string | null;
  username: string;
  photoURL: string;
  verified: boolean;
  following: number;
  followers: number;
  createdAt: string | null;
  updatedAt: string | null;
  totalTweets: number;
  totalPhotos: number;
  pinnedTweet: string | null;
  coverPhotoURL: string | null;
};

export type EditableData = Extract<
  keyof User,
  'bio' | 'name' | 'website' | 'photoURL' | 'location' | 'coverPhotoURL'
>;

export type EditableUserData = Pick<User, EditableData>;

// export const userConverter: FirestoreDataConverter<User> = {
//   toFirestore(user) {
//     return { ...user };
//   },
//   fromFirestore(snapshot, options) {
//     const data = snapshot.data(options);
//     return { ...data } as User;
//   }
// };
