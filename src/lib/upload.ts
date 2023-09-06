import { IPFS_API_KEY } from "./const";
import ipfsApi from '@lib/api/ipfsApi';
type IpfsApiResponse = {
    IpfsHash?: string;
}
export const upload = async (data: unknown): Promise<string> => {

    const config = {
        headers: {
            Authorization: `Bearer ${IPFS_API_KEY}`
        }
    };
    
    const res = await ipfsApi['upJsonContent'](data, config) as IpfsApiResponse;
    if (res?.IpfsHash) {
        return 'ipfs://' + res.IpfsHash;
    }

    return '';
}