import { MediaSet, Profile, Attribute } from '@lens-protocol/react-web';

import { IPFS_GATEWAY } from './const';
import { User } from './types/user';
import { Maybe } from '@lens-protocol/client';
import { Accent, Theme } from './types/theme';

export function formatContent(item: any) {
  if (!item.contentResponse) {
    return {};
  }
  const contentItem = JSON.parse(item.contentResponse);
  if (contentItem.image) {
    contentItem.image = contentItem.image.replace('ipfs://', IPFS_GATEWAY);
  }
  return { ...item, ...contentItem };
}

export function formatAvater(imgUrl: any) {
  if (!imgUrl) {
    return (
      IPFS_GATEWAY +
      'QmXmQQ2ThRHCMgDZFTfKpYBjLeCRGJNcEHCzWtGV1T41sU?_gl=1*no7k0p*rs_ga*MTYyNTY0OTE5OS4xNjg0MjE2MzQ3*rs_ga_5RMPXG14TE*MTY4NjY2NDk3My4zMC4xLjE2ODY2NjY4NTAuNTUuMC4w'
    );
  }
  if (imgUrl.indexOf('http://') !== -1 || imgUrl.indexOf('https://') !== -1) {
    return imgUrl;
  } else if (imgUrl.startsWith('ipfs://')) {
    let result = imgUrl.substring(7, imgUrl.length);
    return `https://lens.infura-ipfs.io/ipfs/${result}`;
  }
}

export function formatPicture(picture: any) {
  if (picture == undefined || picture == null) {
    return picture;
  }
  if (picture.__typename === 'MediaSet') {
    if (
      picture.original.mimeType &&
      picture.original.mimeType.indexOf('video') >= 0
    ) {
      if (picture.original.cover) {
        if (picture.original.cover.startsWith('ipfs://')) {
          let result = picture.original.cover.substring(
            7,
            picture.original.cover.length
          );
          return `https://lens.infura-ipfs.io/ipfs/${result}`;
        } else if (picture.original.cover.startsWith('ar://')) {
          let result = picture.original.cover.substring(
            4,
            picture.original.cover.length
          );
          return `https://arweave.net/${result}`;
        } else {
          return picture.original.cover;
        }
      }
      return '/cover.png';
    } else {
      if (picture.original.url.startsWith('ipfs://')) {
        let result = picture.original.url.substring(
          7,
          picture.original.url.length
        );
        return `https://lens.infura-ipfs.io/ipfs/${result}`;
      } else if (picture.original.url.startsWith('ar://')) {
        let result = picture.original.url.substring(
          4,
          picture.original.url.length
        );
        return `https://arweave.net/${result}`;
      } else {
        return picture.original.url;
      }
    }
  } else {
    return picture;
  }
}

export function formatVideoUrl(url: any) {
  if (url) {
    if (url.startsWith('ipfs://')) {
      let result = url.substring(7, url.length);
      return `https://ipfs.io/ipfs/${result}`;
    } else if (url.startsWith('ar://')) {
      let result = url.substring(4, url.length);
      return `https://arweave.net/${result}`;
    } else {
      return url;
    }
  }
  return '';
}

export function formatNickName(nickname: any) {
  if (!nickname) {
    return '';
  }
  const splitName = nickname.split('.');
  if (splitName.length > 0) {
    return splitName[0];
  } else {
    return '';
  }
}

function formatMonthAndDay(date: any) {
  var month = (date.getMonth() + 1).toString().padStart(2, '0');
  var day = date.getDate().toString().padStart(2, '0');
  return month + '-' + day;
}

export function formatDate(dateString: any) {
  if (dateString === undefined || dateString === '') {
    return '';
  }
  var currentDate = new Date();
  var inputDate = new Date(dateString);

  if (inputDate.getFullYear() !== currentDate.getFullYear()) {
    return inputDate.getFullYear() + '-' + formatMonthAndDay(inputDate);
  } else {
    return formatMonthAndDay(inputDate);
  }
}
type UserCardProps = User & {
  modal?: boolean;
  follow?: boolean;
  isFollowingbserver?: boolean;
  profile: Profile;
};

export function formatUser(userProfile: Profile) {
  let userFormate: UserCardProps = {
    id: userProfile.id.toString(),
    bio: userProfile.bio,
    name: formatNickName(userProfile.name)
      ? formatNickName(userProfile.name)
      : formatNickName(userProfile.handle),
    username: formatNickName(userProfile.handle),
    photoURL: userProfile.picture
      ? formatAvater((userProfile.picture as MediaSet)?.original?.url)
      : '',
    coverPhotoURL: userProfile.coverPicture
      ? formatAvater((userProfile.coverPicture as MediaSet)?.original?.url)
      : '',
    createdAt: '',
    followers: userProfile.stats.totalFollowers,
    following: userProfile.stats.totalFollowing,
    theme: getProfileAttribute(userProfile?.__attributes, 'theme') as Theme,
    accent: getProfileAttribute(userProfile?.__attributes, 'accent') as Accent,
    website: getProfileAttribute(userProfile?.__attributes, 'website'),
    location: getProfileAttribute(userProfile?.__attributes, 'location'),
    verified: false,
    totalTweets: userProfile.stats.totalPosts,
    totalPhotos: 0,
    updatedAt: '',
    pinnedTweet: '',
    follow: userProfile.isFollowedByMe,
    isFollowingbserver: userProfile.isFollowingObserver,
    modal: false,
    profile: userProfile
  };

  return userFormate;
}
type Key =
  | 'hasPrideLogo'
  | 'app'
  | 'twitter'
  | 'location'
  | 'website'
  | 'statusEmoji'
  | 'statusMessage'
  | 'theme'
  | 'accent';

export const getProfileAttribute = (
  attributes: Maybe<Attribute[]> | undefined,
  key: Key
): string => {
  return attributes?.find((el) => el.key === key)?.value ?? '';
};

export function formatImgList(media: any) {
  const obj =
    media && media.length
      ? media.map((img: any, index: any) => {
          return {
            id: index.toString(),
            src: img.original.url,
            alt: img.original.altTag ? img.original.altTag : ''
          };
        })
      : null;
  return obj;
}

export function formatVideoList(media: any) {
  const obj =
    media && media.length
      ? media.map((video: any, index: any) => {
          return {
            id: index.toString(),
            url: video.original.url,
            alt: video.original.altTag ? video.original.altTag : '',
            cover: video.original.cover ? video.original.cover : ''
          };
        })
      : null;
  return obj;
}
