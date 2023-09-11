import {
  CollectState,
  Comment,
  SimpleCollectModuleSettings,
  Post,
  ProfileOwnedByMe
} from '@lens-protocol/react-web';
import { useCollectWithSelfFundedFallback } from '@lib/hooks/useCollectWithSelfFundedFallback';
import { useEffect, useState } from 'react';
import { preventBubbling } from '@lib/utils';
import { Button } from '@components/ui/button';
import { useBalance } from 'wagmi';
import { toast } from 'react-hot-toast';

type CollectButtonProps = {
  collector: ProfileOwnedByMe;
  publication: Post | Comment;
  btnClass: string;
};

export default function CollectButton({
  collector,
  publication,
  btnClass
}: CollectButtonProps) {
  const {
    execute: collect,
    error,
    isPending: loading
  } = useCollectWithSelfFundedFallback({ collector, publication });
  console.log('publication', publication);
  const isFollowedByMe = publication?.profile?.isFollowedByMe;
  const collectModule: any = (
    publication?.collectModule as SimpleCollectModuleSettings
  )?.feeOptional;

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
      toast.error('not has Amount');
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
      onClick={preventBubbling(handleCollect)}
    >
      Approve Collect Module
    </Button>
  );

  console.log(publication?.collectPolicy?.state);
  console.log(CollectState.NOT_A_FOLLOWER);
  console.log(publication?.profile);
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
