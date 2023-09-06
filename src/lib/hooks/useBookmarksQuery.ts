

import { TweetProps } from '@components/tweet/tweet';
import { AnyPublication, ContentPublication, Profile, ProfileId, appId } from '@lens-protocol/react-web';
import { formatImgList, formatUser, formatVideoList } from '@lib/FormatContent';
import { apolloClient } from '@lib/apollo-client';
import { APP_ID } from '@lib/const';
import { Post, PostFieldsFragment, Publication, PublicationMainFocus, PublicationsProfileBookmarkedQueryRequest, PublicationsProfileBookmarksDocument } from '@lib/types/generated';
import { useEffect, useState } from 'react';

type useBookmarksQueryArgs = {
    profileId: ProfileId;
};

const publicationsProfileBookmarks = (request: PublicationsProfileBookmarkedQueryRequest) => {
    return apolloClient.query({
        query: PublicationsProfileBookmarksDocument,
        variables: {
            request,
        }
    });
};

export function useBookmarksQuery({ profileId }: useBookmarksQueryArgs) {

    const [formateList, setFormateList] = useState<TweetProps[]>([]);

    const [loading, setLoading] = useState(false);

    const execute = async () => {
        setLoading(true);
        const result = await publicationsProfileBookmarks({
            profileId,
            limit: 20,
            metadata: {
                mainContentFocus: [
                    PublicationMainFocus.Image,
                    PublicationMainFocus.Video,
                    PublicationMainFocus.TextOnly
                ],
            },
            sources: [appId(APP_ID), appId('lenster')]
        });
        let data = result.data.publicationsProfileBookmarks.items;
        if (data && data.length > 0) {
            let list: TweetProps[] = data.filter((it) => it != null && it.__typename === 'Post')
                .map((field) => {
                    const postItem = field as Post
                    const isVideo = postItem?.metadata?.mainContentFocus === 'VIDEO';
                    const imagesList = isVideo
                        ? null
                        : formatImgList(postItem?.metadata?.media);
                    const videoList = isVideo
                        ? formatVideoList(postItem?.metadata?.media)
                        : null;
                    return {
                        id: postItem.id.toString(),
                        text: postItem.metadata.content,
                        isVideo: isVideo,
                        images: imagesList,
                        videos: videoList,
                        parent: null,
                        userLikes: 0,
                        user: formatUser(postItem.profile as unknown as Profile),
                        createdBy: ' ',
                        createdAt: postItem.createdAt,
                        updatedAt: '',
                        userReplies: postItem.stats.totalAmountOfComments,
                        userRetweets: 0,
                        profile: postItem.profile as unknown as Profile,
                        publication: postItem as unknown as AnyPublication
                    };

                });
            setFormateList(list);
        }
        setLoading(false);
    };

    let load = false;


    useEffect(() => {
        if (!load) {
            execute();
            load = true;
        }
    }, []);

    return {
        data: formateList,
        loading
    };

};


