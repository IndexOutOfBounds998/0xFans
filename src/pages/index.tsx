import { AuthLayout } from '@components/layout/auth-layout';
import { SEO } from '@components/common/seo';
import { LoginMain } from '@components/login/login-main';
import { LoginFooter } from '@components/login/login-footer';
import type { ReactElement, ReactNode } from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { loadCatalog } from 'translations/utils';
import { useLingui } from '@lingui/react';

export async function getServerSideProps(
  ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<any>> {
  console.log(222222)
  return {
    props: {
      i18n: await loadCatalog(ctx.locale as string)
    }
  };
}

export default function Login(): JSX.Element {
  useLingui();
  return (
    <div className='grid min-h-screen grid-rows-[1fr,auto]'>
      <SEO
        title='0xFans - It’s what’s happening'
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
