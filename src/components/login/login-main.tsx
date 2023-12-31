import { useAuth } from '@lib/context/auth-context';
import { NextImage } from '@components/ui/next-image';
import { CustomIcon } from '@components/ui/custom-icon';
import { Button } from '@components/ui/button';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
export function LoginMain(): JSX.Element {
  const { signInWithLens, profileByMe, isLoginAction } = useAuth();

  const { isConnected } = useAccount();
  return (
    <main className='grid lg:grid-cols-[1fr,45vw]'>
      <div className='relative hidden items-center justify-center  lg:flex'>
        <NextImage
          imgClassName='object-cover'
          blurClassName='bg-accent-blue'
          src='/assets/twitter-banner.png'
          alt='0xFans banner'
          layout='fill'
          useSkeleton
        />
        <i className='absolute'>
          <CustomIcon className='h-96 w-96 text-white' iconName='oxFnasIcon' />
        </i>
      </div>
      <div className='flex flex-col items-center justify-between gap-6 p-8 lg:items-start lg:justify-center'>
        <i className='mb-0 self-center lg:mb-10 lg:self-auto'>
          <CustomIcon
            className='-mt-4 h-6 w-6 text-accent-blue lg:h-12 lg:w-12 dark:lg:text-twitter-icon'
            iconName='oxfansLeft'
          />
        </i>
        <div className='flex max-w-xs flex-col gap-4 font-twitter-chirp-extended lg:max-w-none lg:gap-16'>
          <h1
            className='text-3xl before:content-["Sign_up_to_support_your_favorite_creators."]
                       lg:text-6xl lg:before:content-["Sign_up_to_support_your_favorite_creators"]'
          />
          <h2 className='hidden text-xl lg:block lg:text-3xl'>
            Join 0xFans today.
          </h2>
        </div>
        <div className='flex max-w-xs flex-col gap-6 [&_button]:py-2'>
          <div className='grid gap-3 font-bold'>
            {isConnected ? (
              !isLoginAction ? (
                <Button
                  className='flex justify-center gap-2 border border-light-line-reply font-bold text-light-primary transition
                       hover:bg-[#e6e6e6] focus-visible:bg-[#e6e6e6] active:bg-[#cccccc] dark:border-0 dark:bg-white
                       dark:hover:brightness-90 dark:focus-visible:brightness-90 dark:active:brightness-75'
                  onClick={signInWithLens}
                >
                  <CustomIcon iconName='LensIcon' /> Sign up with lens
                </Button>
              ) : (
                ''
              )
            ) : (
              <ConnectButton />
            )}

            {isLoginAction && !profileByMe ? <p>regiser</p> : ''}

            <p
              className='inner:custom-underline inner:custom-underline text-center text-xs
                         text-light-secondary inner:text-accent-blue dark:text-dark-secondary'
            >
              By signing up, you agree to the{' '}
              <a href='https://0xfans.com/tos' target='_blank' rel='noreferrer'>
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href='https://0xfans.com/privacy'
                target='_blank'
                rel='noreferrer'
              >
                Privacy Policy
              </a>
              , including{' '}
              <a
                href='https://help.0xfans.com/rules-and-policies/0xfans-cookies'
                target='_blank'
                rel='noreferrer'
              >
                Cookie Use
              </a>
              .
            </p>
          </div>
          {/* <div className='flex flex-col gap-3'>
            <p className='font-bold'>Already have an account? </p>
            <Button
              className='border border-light-line-reply font-bold text-accent-blue hover:bg-accent-blue/10
                         focus-visible:bg-accent-blue/10 focus-visible:!ring-accent-blue/80 active:bg-accent-blue/20
                         dark:border-light-secondary'
            >
              Sign in
            </Button>
          </div> */}
        </div>
      </div>
    </main>
  );
}
