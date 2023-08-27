import { useUpIpfs } from './useUpIpfs';
import { getAuthenticatedClient } from '@lib/getAuthenticatedClient';
import { useSignTypedData } from 'wagmi';
import { useActiveProfile } from '@lens-protocol/react-web';
import { useState } from 'react';
import { uuid } from '@walletconnect/legacy-utils';
import {
  PublicationMetadataV2Input,
  PublicationMainFocus,
  PublicationMetadataDisplayTypes,
  MetadataAttributeInput
} from '@lens-protocol/client';
import { Profile } from '@lens-protocol/react-web';
import {
  CollectModuleParams,
  ReferenceModuleParams
} from '@lens-protocol/client/dist/declarations/src';
import {
  ContractType,
  LensGatedSDK,
  LensEnvironment,
  ScalarOperator
} from '@lens-protocol/sdk-gated';
import { Web3Provider } from '@ethersproject/providers';

type PostData = {
  callbackOnError: (error: any) => void;
};

type PostSubmit = {
  images: File[];
  title: string;
  content: string;
  collectData: CollectData;
};

type CollectData = {
  isCollect?: boolean;
  followerOnly?: boolean;
  isCost?: boolean;
  selectAddress?: string;
  amount?: number;
  referralFee?: number;
  isLimit?: boolean;
  collectLimit?: number;
  isTimeLimit?: boolean;
};

export function usePost({ callbackOnError }: PostData) {
  const { data: profile, error, loading: profileLoading } = useActiveProfile();

  const { signTypedDataAsync, isLoading: typedDataLoading } =
    useSignTypedData();

  const { execute, loading, url } = useUpIpfs({ type: 'upJsonContent' });
  const {
    execute: upImg,
    loading: imgLoading,
    url: imgUrl
  } = useUpIpfs({ type: 'upLoadImg' });

  const [postLoading, setPostLoading] = useState(false);

  const CollectModuleInfo = (collectData: CollectData, profile: Profile) => {
    let collectModule: CollectModuleParams = {
      simpleCollectModule: {
        followerOnly: false,
        fee: {
          amount: {
            currency: '',
            value: '0'
          },
          recipient: '',
          referralFee: 0
        },
        collectLimit: null,
        endTimestamp: '0'
      }
    };

    //构建 收藏模块 和 转发模块
    if (collectData.isCollect) {
      collectModule = {
        simpleCollectModule: {
          followerOnly: collectData.followerOnly || false
        }
      };
      if (collectData.isCost && collectModule.simpleCollectModule) {
        collectModule.simpleCollectModule.fee = {
          amount: {
            currency: collectData.selectAddress || '',
            value: collectData.amount ? collectData.amount + '' : '0'
          },
          recipient: profile.ownedBy,
          referralFee: parseFloat(collectData.referralFee + '')
        };
      }
      if (collectData.isLimit && collectModule.simpleCollectModule) {
        collectModule.simpleCollectModule.collectLimit =
          collectData.collectLimit + '';
      }
      if (collectData.isTimeLimit && collectModule.simpleCollectModule) {
        collectModule.simpleCollectModule.endTimestamp = collectData.isTimeLimit
          ? ''
          : '0';
      }
      if (collectData.followerOnly && collectModule.simpleCollectModule) {
        collectModule.simpleCollectModule.followerOnly =
          collectData.followerOnly;
      }
    } else {
      collectModule = {
        revertCollectModule: true
      };
    }
    return collectModule;
  };

  const upIpfsImg = async (images: File[]) => {
    let imagesList = [];
    for (let i = 0; i < images.length; i++) {
      const item = images[i];
      const formData = new FormData();
      formData.append('file', item);
      const url = await upImg(formData);
      if (url) {
        imagesList.push({
          cover: 'ipfs://' + url,
          item: 'ipfs://' + url,
          type: item.type
        });
      }
    }
    return imagesList;
  };

  async function uploadToIPFS(metadata: any) {
    /* create an instance of the Lens SDK gated content with the environment */
    const sdk = await LensGatedSDK.create({
      provider: new Web3Provider(window.ethereum),
      signer: new Web3Provider(window.ethereum).getSigner(),
      env: LensEnvironment.Mumbai
    });

    await sdk.connect({
      address: profile.ownedBy, // your signer's wallet address
      env: LensEnvironment.Mumbai
    });

    let condition = {};

    /* check the gating type (nft or ERC20) and define access condition */
    condition = {
      nft: null
    };

    /* encrypt the metadata using the Lens SDK and upload it to IPFS */
    const { contentURI, encryptedMetadata } = await sdk.gated.encryptMetadata(
      metadata,
      profile.id,
      {
        ...condition
      },
      async function (EncryptedMetadata) {
        debugger;
        const added = execute(JSON.stringify(EncryptedMetadata));
        return added;
      }
    );

    /* return the metadata and contentURI to the caller */
    return {
      encryptedMetadata,
      contentURI
    };
  }

  const submit = async (
    { images, title, content, collectData }: PostSubmit,
    profileUser: Profile
  ) => {
    setPostLoading(true);

    let imagesList = await upIpfsImg(images);
    let attributes: MetadataAttributeInput[] = images.map((item) => {
      return {
        displayType: PublicationMetadataDisplayTypes.Number,
        traitType: 'size',
        value: item.size.toString()
      };
    });

    let collectModule: CollectModuleParams = CollectModuleInfo(
      collectData,
      profileUser
    );

    let referenceModule: ReferenceModuleParams = {
      followerOnlyReferenceModule: false
    };

    let obj: PublicationMetadataV2Input = {
      version: '2.0.0',
      metadata_id: uuid(),
      appId: '0xfans',
      image: imagesList[0] ? imagesList[0].item : null,
      imageMimeType: imagesList[0] ? imagesList[0].type : null,
      content: content,
      attributes: attributes,
      locale: 'en-US',
      mainContentFocus: PublicationMainFocus.Image,
      media: imagesList,
      tags: ['trip'],
      name: `Post by ${profileUser.handle}`
    };
    // const url2 = await uploadToIPFS(obj);
    const url = await execute(obj);
    if (url) {
      // lensClient.explore.publications()
      try {
        const lensClient = await getAuthenticatedClient();
        const typedDataResult =
          await lensClient.publication.createPostTypedData({
            profileId: profileUser.id,
            contentURI: 'ipfs://' + url, // or arweave
            collectModule: collectModule,
            referenceModule: referenceModule
          });
        // typedDataResult is a Result object
        const data = typedDataResult.unwrap();
        console.log(
          `0x${data.typedData.domain.verifyingContract.substring(2)}`
        );
        // sign with the wallet
        const signTypedData = await signTypedDataAsync({
          primaryType: 'PostWithSig',
          domain: {
            ...data.typedData.domain,
            verifyingContract: `0x${data.typedData.domain.verifyingContract.substring(
              2
            )}`
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
          // 定义一个回调函数 又调用方执行
          // callbackOnSuccess();
        } else {
          callbackOnError(broadcastResultValue.reason);
        }
      } catch (error) {
        callbackOnError(error);
        setPostLoading(false);
      }
    }
    setPostLoading(false);
  };

  return { submit, postLoading };
}
