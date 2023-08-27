import { useUpIpfs } from './useUpIpfs';
import { getAuthenticatedClient } from '@lib/getAuthenticatedClient';
import { useSignTypedData } from 'wagmi';
import { uuid } from '@walletconnect/legacy-utils';
import { useState } from 'react';
import { Profile } from '@lens-protocol/react-web';
import { APP_ID } from '@lib/const';

type commentData = {
  publication: any;
};

export function useSendComment({ publication }: commentData) {
  const { signTypedDataAsync, isLoading: typedDataLoading } =
    useSignTypedData();

  const { execute, url: hashUrl } = useUpIpfs({ type: 'upJsonContent' });

  const [loading, setLoading] = useState(false);

  const submit = async (commentValue: string, profile: Profile) => {
    setLoading(true);
    const obj = {
      metadata_id: uuid(),
      appId: APP_ID,
      version: '1.0.0',
      animatedUrl: null,
      content: commentValue,
      contentWarning: null,
      description: null,
      image: null,
      imageMimeType: null,
      locale: 'en',
      mainContentFocus: 'TEXT_ONLY',
      media: [],
      tags: null,
      name: `Comment by ${profile.handle}`
    };
    const hash = await execute(obj);
    if (hash) {
      // lensClient.explore.publications()
      const lensClient = await getAuthenticatedClient();
      const typedDataResult =
        await lensClient.publication.createCommentTypedData({
          profileId: profile.id,
          publicationId: publication.id,
          contentURI: 'ipfs://' + hash, // or arweave
          collectModule: {
            revertCollectModule: true // collect disabled
          },
          referenceModule: {
            followerOnlyReferenceModule: false // anybody can comment or mirror
          }
        });
      // typedDataResult is a Result object
      const data = typedDataResult.unwrap();
      // sign with the wallet
      const signTypedData = await signTypedDataAsync({
        primaryType: 'CommentWithSig',
        domain: {
          ...data.typedData.domain,
          verifyingContract: `0x${data.typedData.domain.verifyingContract}`
        },
        message: data.typedData.value,
        types: data.typedData.types
      });
      // broadcast
      const broadcastResult = await lensClient.transaction.broadcast({
        id: data.id,
        signature: signTypedData
      });

      // broadcastResult is a Result object
      const broadcastResultValue = broadcastResult.unwrap();

      if (broadcastResultValue.__typename == 'RelayerResult') {
      }
    }
  };

  return { submit, loading };
}
