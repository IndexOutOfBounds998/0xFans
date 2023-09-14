import {
  CollectState,
  Comment,
  SimpleCollectModuleSettings,
  Post,
  ProfileOwnedByMe
} from '@lens-protocol/react-web';
import { useCollectWithSelfFundedFallback } from '@lib/hooks/useCollectWithSelfFundedFallback';
import { preventBubbling } from '@lib/utils';
import { Button } from '@components/ui/button';
import { useBalance } from 'wagmi';
import { toast } from 'react-hot-toast';
import { FollowButton } from './follow-button';
import { useAuth } from '@lib/context/auth-context';
import { useLingui } from '@lingui/react';
import { Trans, t } from '@lingui/macro';

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
  useLingui();
  const {
    execute: collect,
    error,
    isPending: loading
  } = useCollectWithSelfFundedFallback({ collector, publication });
  const { profileByMe } = useAuth();
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

  let isEnd = false;

  console.log(Date.parse(new Date().toString()));
  console.log(
    Date.parse(
      (publication?.collectModule as SimpleCollectModuleSettings)
        ?.endTimestampOptional ?? ''
    )
  );
  console.log(
    (publication?.collectModule as SimpleCollectModuleSettings)
      ?.endTimestampOptional ?? ''
  );
  if (
    (publication?.collectModule as SimpleCollectModuleSettings)
      ?.endTimestampOptional
  ) {
    const now = Date.parse(new Date().toString());
    const endTime = Date.parse(
      (publication?.collectModule as SimpleCollectModuleSettings)
        ?.endTimestampOptional ?? ''
    );
    debugger;
    if (now > endTime) {
      isEnd = true;
    } else {
      isEnd = false;
    }
  }

  const handleCollect = async (): Promise<void> => {
    if (hasAmount) {
      return collect();
    } else {
      toast.error(t`Insufficient balance`);
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
      <Trans>Approve Collect Module</Trans>
    </Button>
  );

  switch (publication?.collectPolicy?.state) {
    case CollectState.COLLECT_TIME_EXPIRED:
      return <CollectBtn title={t`Collecting ended`} />;
    case CollectState.COLLECT_LIMIT_REACHED:
      return <CollectBtn title={t`Collect limit reached`} />;
    case CollectState.NOT_A_FOLLOWER:
      return isFollowedByMe ? (
        <CanCollectBtn />
      ) : (
        profileByMe ? <FollowButton
          btnClass='w-full'
          userTargetId={publication?.profile.id.toString()}
          userTargetUsername={publication?.profile.name || ''}
          userIsFollowed={publication?.profile.isFollowedByMe}
          followee={publication?.profile}
          follower={profileByMe}
        /> : <CollectBtn title={t`Only followers can collect`} />
      );
    case CollectState.CANNOT_BE_COLLECTED:
      return <CollectBtn title={`Cannot be collected`} />;
    case CollectState.CAN_BE_COLLECTED:
      return isEnd ? (
        <CollectBtn title={t`Collection time has expired`} />
      ) : (
        <CanCollectBtn />
      );
  }
}
