import { getAuthenticatedClient } from '@lib/getAuthenticatedClient';
import { useEffect, useState } from 'react';
import { ApprovedAllowanceAmountFragment, CollectModules, FeeFollowModuleParams, FollowModules, ReferenceModules, SimpleCollectModuleParams } from "@lens-protocol/client";
import { FeeFollowModuleSettings } from '@lens-protocol/react-web';


export function useApprovedFollowModuleAllowance(followModule: FeeFollowModuleSettings) {



    const [result, setResult] = useState();


    useEffect(() => {
        execute();
    }, [followModule])

    const execute = async () => {

        if (!followModule) {
            return;
        }
        const client = await getAuthenticatedClient();
        let res = await client.modules.approvedAllowanceAmount({
            currencies: [followModule?.amount?.asset?.address],
            followModules: [FollowModules.FeeFollowModule],
        });
        let r = res.unwrap();
        let allowance;
        r.forEach((item => {
            allowance = item.allowance;
        }))
        setResult(allowance);


    }



    return { result };
}
