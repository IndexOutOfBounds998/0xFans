import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@lib/context/auth-context';
import { sleep } from '@lib/utils';
import { Placeholder } from '@components/common/placeholder';
import type { LayoutProps } from './common-layout';
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { MAIN_NETWORK } from '@lib/const';
import { polygon, polygonMumbai } from "wagmi/chains";

export function AuthLayout({ children }: LayoutProps): JSX.Element {
  const [pending, setPending] = useState(true);

  const { user, loading, isLoginAction, loginAddress, signOut } = useAuth();

  const { replace } = useRouter();

  const { chain } = useNetwork();

  const { address } = useAccount();

  const { switchNetwork } = useSwitchNetwork();

  useEffect(() => {
    
    if ((address && loginAddress) || (address && loginAddress === '')) {

      if (address.toLocaleLowerCase() !== loginAddress.toLocaleLowerCase()) {
        signOut();
      }

    }
  }, [address, loginAddress]);


  useEffect(() => {
    if (chain && switchNetwork) {
      const targetNetworkId = MAIN_NETWORK ? polygon.id : polygonMumbai.id;
      if (chain.id !== targetNetworkId) {
        switchNetwork(targetNetworkId);
      }
    }
  }, [chain, switchNetwork]);

  useEffect(() => {
    const checkLogin = async (): Promise<void> => {
      setPending(true);
      if (isLoginAction && user) {
        await sleep(500);
        void replace('/home');
      } else if (!loading) {
        await sleep(500);
        setPending(false);
      }

      if (isLoginAction && !user) {
        await sleep(500);
        void replace('/');
      }

    };

    void checkLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading, isLoginAction]);





  if (loading || pending) return <Placeholder />;

  return <>{children}</>;
}
