import {
  CollectState,
  Comment,
  Post,
  ProfileOwnedByMe
} from '@lens-protocol/react-web';
import { useCollectWithSelfFundedFallback } from '@lib/hooks/useCollectWithSelfFundedFallback';
import { useEffect, useState } from 'react';
import { preventBubbling } from '@lib/utils';
import { Button } from '@components/ui/button';
import { useBalance } from 'wagmi';

type CollectButtonProps = {
  collector?: ProfileOwnedByMe;
  publication: Post | Comment;
  btnClass: string;
};

export default function CollectButton({
  collector,
  publication,
  btnClass
}: CollectButtonProps) {
  let collect;
  let loading;
  if (collector) {
    const {
      execute: fun,
      error,
      isPending
    } = useCollectWithSelfFundedFallback({ collector, publication });
    collect = fun;
    loading = isPending;
  }
  console.log('publication', publication);
  const isFollowedByMe = publication?.profile?.isFollowedByMe;
  const collectModule: any = publication?.collectModule?.feeOptional;

  const { data: balanceData } = useBalance({
    address: `0x${publication?.profile?.ownedBy.slice(2)}`,
    token: collectModule?.amount?.asset?.address,
    formatUnits: collectModule?.amount?.asset?.decimals,
    watch: true
  });

  let hasAmount = false;

  if (
    balanceData &&
    parseFloat(balanceData?.formatted) <
      parseFloat(collectModule?.amount?.value)
  ) {
    hasAmount = false;
  } else {
    hasAmount = true;
  }

  const handleCollect = async (): Promise<void> => {
    if (hasAmount) {
      return collect();
    } else {
      alert('not has Amount');
    }
  };

  const CollectBtn = ({ title }: { title: string }) => (
    <Button
      disabled
      className={`self-start border bg-light-primary px-4 py-1.5 font-bold text-white hover:bg-light-primary/90
                   dark:bg-light-border
                   dark:text-light-primary dark:hover:bg-light-border/90 ${btnClass}`}
    >
      {title}
    </Button>
  );

  const CanCollectBtn = () => (
    <Button
      loading={loading}
      className={`self-start border bg-light-primary px-4 py-1.5 font-bold text-white hover:bg-light-primary/90
                   focus-visible:bg-light-primary/90 active:bg-light-border/75 dark:bg-light-border
                   dark:text-light-primary dark:hover:bg-light-border/90 dark:focus-visible:bg-light-border/90
                   dark:active:bg-light-border/75 ${btnClass}`}
      onClick={preventBubbling(collect)}
    >
      Approve Collect Module
    </Button>
  );

  switch (publication?.collectPolicy?.state) {
    case CollectState.COLLECT_TIME_EXPIRED:
      return <CollectBtn title='Collecting ended' />;
    case CollectState.COLLECT_LIMIT_REACHED:
      return <CollectBtn title='Collect limit reached' />;
    case CollectState.NOT_A_FOLLOWER:
      return isFollowedByMe ? (
        <CanCollectBtn />
      ) : (
        <CollectBtn title='Only followers can collect' />
      );
    case CollectState.CANNOT_BE_COLLECTED:
      return <CollectBtn title='Cannot be collected' />;
    case CollectState.CAN_BE_COLLECTED:
      return <CanCollectBtn />;
  }
}
