import { getAuthenticatedClient } from '@lib/getAuthenticatedClient';
import { useEffect, useState } from 'react';
import {
  ApprovedAllowanceAmountFragment,
  CollectModules,
  FeeFollowModuleParams,
  FollowModules,
  ReferenceModules,
  SimpleCollectModuleParams
} from '@lens-protocol/client';

export function useApprovedModuleAllowance(
  collectModule: SimpleCollectModuleParams
) {
  const [result, setResult] = useState();

  let loaded = false;

  useEffect(() => {
    execute();
  }, []);

  const execute = async () => {
    if (loaded) {
      return;
    }
    if (!collectModule) {
      return;
    }
    const assetAddress = collectModule?.fee?.amount?.currency;
    const client = await getAuthenticatedClient();
    let res = await client.modules.approvedAllowanceAmount({
      currencies: [assetAddress || ''],
      collectModules: [CollectModules.SimpleCollectModule]
    });
    let r = res.unwrap();
    let allowance;
    r.forEach((item) => {
      allowance = item.allowance;
    });
    setResult(allowance);
    loaded = true;
  };

  return { result };
}
