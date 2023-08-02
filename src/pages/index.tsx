import { AuthLayout } from '@components/layout/auth-layout';
import { SEO } from '@components/common/seo';
import { LoginMain } from '@components/login/login-main';
import { LoginFooter } from '@components/login/login-footer';
import type { ReactElement, ReactNode } from 'react';
import { getWalletClient } from '@wagmi/core';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import { polygon, polygonMumbai } from 'wagmi/chains';
import { useAccount } from 'wagmi';
import { useWalletLogin, useActiveProfile } from '@lens-protocol/react-web';
import { useEffect } from 'react';
import { MAIN_NETWORK } from '../constants/constant';

export default function Login(): JSX.Element {
  // const { chain } = useNetwork();
  //
  // const { switchNetwork } = useSwitchNetwork();
  //
  // const {
  //   execute: login,
  //   error: loginError,
  //   isPending: isLoginPending,
  // } = useWalletLogin();
  //
  // const { isConnected } = useAccount();
  //
  // const { data: profile, error, loading: profileLoading } = useActiveProfile();
  // useEffect(() => {
  //   if (chain && switchNetwork) {
  //     const targetNetworkId = MAIN_NETWORK ? polygon.id : polygonMumbai.id;
  //     if (chain.id !== targetNetworkId) {
  //       switchNetwork(targetNetworkId);
  //     }
  //   }
  // }, [chain, switchNetwork]);
  //
  // const onLoginClick = async () => {
  //   const walletClient = await getWalletClient();
  //
  //   await login({
  //     address: walletClient.account.address,
  //   });
  // };
  return (
    <div className='grid min-h-screen grid-rows-[1fr,auto]'>
      <SEO
        title='Twitter - It’s what’s happening'
        description='From breaking news and entertainment to sports and politics, get the full story with all the live commentary.'
      />
      <LoginMain />
      <LoginFooter />
    </div>
  );
}

Login.getLayout = (page: ReactElement): ReactNode => (
  <AuthLayout>{page}</AuthLayout>
);
