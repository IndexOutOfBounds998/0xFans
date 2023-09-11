import { getAuthenticatedClient } from '@lib/getAuthenticatedClient';
import { useEffect, useState } from 'react';
import { FollowModules } from '@lens-protocol/client';
import { FeeFollowModuleSettings } from '@lens-protocol/react-web';

export function useApprovedFollowModuleAllowance(
  followModule: FeeFollowModuleSettings
) {
  const [result, setResult] = useState();

  let loaded = false;

  useEffect(() => {
    if (!loaded) {
      execute();
    }
    loaded = true;
  }, [followModule]);

  const execute = async () => {
    if (!followModule) {
      return;
    }
    if (followModule?.amount?.asset?.address === undefined) {
      return;
    }
    const client = await getAuthenticatedClient();
    let res = await client.modules.approvedAllowanceAmount({
      currencies: [followModule?.amount?.asset?.address],
      followModules: [FollowModules.FeeFollowModule]
    });
    let r = res.unwrap();
    let allowance;
    r.forEach((item) => {
      allowance = item.allowance;
    });
    setResult(allowance);
  };

  return { result };
}
