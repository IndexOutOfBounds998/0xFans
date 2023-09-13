import { useAuth } from '@lib/context/auth-context';
import { useModal } from '@lib/hooks/useModal';

import { preventBubbling } from '@lib/utils';
import { Modal } from '@components/modal/modal';
import { ActionModal } from '@components/modal/action-modal';
import { Button } from '@components/ui/button';
import {
  Profile,
  ProfileOwnedByMe,
  useUnfollow
} from '@lens-protocol/react-web';
import { useFollowWithSelfFundedFallback } from '@lib/hooks/useFollowWithSelfFundedFallback';
import { useEffect, useState } from 'react';
import { getAuthenticatedClient } from '@lib/getAuthenticatedClient';
import { useApprovedFollowModuleAllowance } from '@lib/hooks/useApprovedFollowModuleAllowance';
import {
  FollowModules,
  GenerateModuleCurrencyApprovalFragment
} from '@lens-protocol/client';
import { useSendTransaction, useBalance, useWaitForTransaction } from 'wagmi';
import { toast } from 'react-hot-toast';
import { Trans, t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import cn from 'clsx';
type FollowButtonProps = {
  userTargetId: string | null;
  userTargetUsername: string;
  userIsFollowed?: boolean;
  follower: ProfileOwnedByMe;
  followee: Profile;
  btnClass?: string | null;
};

export function FollowButton({
  userTargetId,
  userTargetUsername,
  userIsFollowed,
  follower,
  followee,
  btnClass
}: FollowButtonProps): JSX.Element | null {
  useLingui();
 
  const {
    execute: unfollow,
    error: unfollowError,
    isPending: isUnfollowPending
  } = useUnfollow({ follower, followee });

  const {
    execute: follow,
    error: followError,
    isPending: isFollowPending
  } = useFollowWithSelfFundedFallback({
    followee,
    follower
  });

  const onError = (error: any) => {
    console.log(error);
  };

  const {
    data: txData,
    isLoading: transactionLoading,
    sendTransaction
  } = useSendTransaction({
    onError
  });

  const { user } = useAuth();

  const { open, openModal, closeModal } = useModal();

  const [unfollowLoading, setUnfollowLoading] = useState<boolean>(false);

  const [approved, setApproved] = useState<boolean>(false);

  const followModule: any = followee?.followModule;

  const { result: allowance } = useApprovedFollowModuleAllowance(followModule);

  const hasApprove = allowance && allowance === '0x00';

  const { isLoading: waitLoading } = useWaitForTransaction({
    hash: txData?.hash,
    onSuccess: () => {
      setApproved(true);
    },
    onError
  });

  const handleFollow = async (): Promise<void> => {
    if (hasAmount) {
      return follow();
    } else {
      toast.error('not has Amount');
    }
  };

  const handleSuperFollowApprove = async (): Promise<void> => {
    const lensClient = await getAuthenticatedClient();
    const result = await lensClient.modules.generateCurrencyApprovalData({
      currency: followModule?.amount?.asset?.address,
      value: '10',
      followModule: FollowModules.FeeFollowModule
    });

    if (result.isSuccess()) {
      let data = result.unwrap() as GenerateModuleCurrencyApprovalFragment;
      sendTransaction?.({
        account: `0x${data?.from.slice(2)}`,
        to: data?.to,
        data: `0x${data?.data.slice(2)}`
      });
    }
    // return follow();
  };

  const handleUnfollow = async (): Promise<void> => {
    setUnfollowLoading(true);
    closeModal();
    unfollow();
  };

  const { data: balanceData } = useBalance({
    address: `0x${follower?.ownedBy.slice(2)}`,
    token: followModule?.amount?.asset?.address,
    formatUnits: followModule?.amount?.asset?.decimals,
    watch: true
  });

  let hasAmount = false;

  if (
    balanceData &&
    parseFloat(balanceData?.formatted) < parseFloat(followModule?.amount?.value)
  ) {
    hasAmount = false;
  } else {
    hasAmount = true;
  }

  if (user?.id === userTargetId) return null;

  return (
    <>
      <Modal
        modalClassName='flex flex-col gap-6 max-w-xs bg-main-background w-full p-8 rounded-2xl'
        open={open}
        closeModal={closeModal}
      >
        <ActionModal
          title={t`Unfollow` + `@${userTargetUsername}?`}
          description='Their Posts will no longer show up in your home timeline. You can still view their profile, unless their Posts are protected.'
          mainBtnLabel={t`Unfollow`}
          action={handleUnfollow}
          closeModal={closeModal}
        />
      </Modal>

      {userIsFollowed ? (
        <Button
          loading={isUnfollowPending || unfollowLoading}
          className={`dark-bg-tab hover:before:content-[" group group min-w-[106px] self-start border border-light-line-reply px-4
                     py-1.5 font-bold hover:border-accent-red hover:bg-accent-red/10
                     hover:text-accent-red dark:border-light-secondary ${btnClass}`}
          onClick={preventBubbling(openModal)}
        >
          <span className={'block group-hover:hidden'}>
            <Trans>Following</Trans>
          </span>
          <span className={'hidden group-hover:block'}>
            <Trans>Unfollow</Trans>
          </span>
        </Button>
      ) : hasApprove && !approved ? (
        <Button
          loading={transactionLoading || waitLoading}
          className={`self-start border bg-light-primary px-4 py-1.5 font-bold text-white hover:bg-light-primary/90
                   focus-visible:bg-light-primary/90 active:bg-light-border/75 dark:bg-light-border
                   dark:text-light-primary dark:hover:bg-light-border/90 dark:focus-visible:bg-light-border/90
                   dark:active:bg-light-border/75 ${btnClass}`}
          onClick={preventBubbling(handleSuperFollowApprove)}
        >
          <Trans>Approve Follow Module</Trans>
        </Button>
      ) : (
        <Button
          loading={isFollowPending}
          className={`self-start border bg-light-primary px-4 py-1.5 font-bold text-white hover:bg-light-primary/90
                   focus-visible:bg-light-primary/90 active:bg-light-border/75 dark:bg-light-border
                   dark:text-light-primary dark:hover:bg-light-border/90 dark:focus-visible:bg-light-border/90
                   dark:active:bg-light-border/75 ${btnClass}`}
          onClick={preventBubbling(handleFollow)}
        >
          <Trans>Follow</Trans>
        </Button>
      )}
    </>
  );
}
