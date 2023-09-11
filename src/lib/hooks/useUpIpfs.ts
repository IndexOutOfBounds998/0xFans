import ipfsApi from '../api/ipfsApi'; //{ upJsonContent, upLoadImg }
import { IPFS_API_KEY } from '../const';
import { useState } from 'react';
type useUpData = {
  type: string; //upJsonContent or upLoadImg
};
type IpfsApiResponse = {
  IpfsHash?: string;
};
export function useUpIpfs({ type }: useUpData) {
  const [loading, setLoad] = useState(false);
  const [url, setUrl] = useState('');
  const config = {
    headers: {
      Authorization: `Bearer ${IPFS_API_KEY}`
    }
  };

  const execute = async (data: any) => {
    setLoad(true);
    const res = (await ipfsApi[type as keyof typeof ipfsApi](
      data,
      config
    )) as IpfsApiResponse;
    if (res?.IpfsHash) {
      setUrl('ipfs://' + res.IpfsHash);
      setLoad(false);
      return res.IpfsHash;
    }
  };

  return {
    execute,
    loading,
    url
  };
}
