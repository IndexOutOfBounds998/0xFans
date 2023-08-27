import { SWRConfig } from 'swr';
import { Toaster } from 'react-hot-toast';
import { fetchJSON } from '@lib/fetch';
import { WindowContextProvider } from '@lib/context/window-context';
import { Sidebar } from '@components/sidebar/sidebar';
import type { DefaultToastOptions } from 'react-hot-toast';
import type { LayoutProps } from './common-layout';
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { MAIN_NETWORK } from '@lib/const';
import { polygon, polygonMumbai } from "wagmi/chains";
import { useEffect } from 'react';
import { useAuth } from '@lib/context/auth-context';
const toastOptions: DefaultToastOptions = {
  style: {
    color: 'white',
    borderRadius: '4px',
    backgroundColor: 'rgb(var(--main-accent))'
  },
  success: { duration: 4000 }
};

export function MainLayout({ children }: LayoutProps): JSX.Element {

  const { loginAddress, signOut } = useAuth();

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

  return (
    <div className='flex w-full justify-center gap-0 lg:gap-4'>
      <WindowContextProvider>
        <Sidebar />
        <SWRConfig value={{ fetcher: fetchJSON }}>{children}</SWRConfig>
      </WindowContextProvider>
      <Toaster
        position='bottom-center'
        toastOptions={toastOptions}
        containerClassName='mb-12 xs:mb-0'
      />
    </div>
  );
}
