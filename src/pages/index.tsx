import { AuthLayout } from '@components/layout/auth-layout';
import { SEO } from '@components/common/seo';
import { LoginMain } from '@components/login/login-main';
import { LoginFooter } from '@components/login/login-footer';
import type { ReactElement, ReactNode } from 'react';
import { GetStaticProps } from 'next';
import { loadCatalog } from 'translations/utils';
import { useLingui } from '@lingui/react';

export const getStaticProps: GetStaticProps = async (ctx) => {
  const translation = await loadCatalog(ctx.locale!);
  return {
    props: {
      translation,
      i18n: translation
    }
  };
};

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
