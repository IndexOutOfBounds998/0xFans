import { useRouter } from 'next/router';
import {
  TrendsLayout,
  ProtectedLayout
} from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import { SEO } from '@components/common/seo';
import { MainHeader } from '@components/home/main-header';
import { MainContainer } from '@components/home/main-container';
import { AsideTrends } from '@components/aside/aside-trends';
import { Button } from '@components/ui/button';
import { ToolTip } from '@components/ui/tooltip';
import { HeroIcon } from '@components/ui/hero-icon';
import type { ReactElement, ReactNode } from 'react';

import { GetStaticProps } from 'next';
import { loadCatalog } from 'translations/utils';
import { useLingui } from '@lingui/react';
import { Trans, t } from '@lingui/macro';
export const getStaticProps: GetStaticProps = async (ctx) => {
  const translation = await loadCatalog(ctx.locale!);

  return {
    props: {
      translation,
      i18n: translation
    }
  };
};

export default function Trends(): JSX.Element {
  useLingui();
  const { back } = useRouter();

  return (
    <MainContainer>
      <SEO title='Popular tags / 0xFansProtocol ' />
      <MainHeader useActionButton title={t`Popular tags`} action={back}>
        <Button
          className='dark-bg-tab group relative ml-auto cursor-not-allowed p-2 hover:bg-light-primary/10
                     active:bg-light-primary/20 dark:hover:bg-dark-primary/10 dark:active:bg-dark-primary/20'
        >
          <HeroIcon className='h-5 w-5' iconName='Cog8ToothIcon' />
          <ToolTip tip='Settings' />
        </Button>
      </MainHeader>
      <AsideTrends inTrendsPage />
    </MainContainer>
  );
}

Trends.getLayout = (page: ReactElement): ReactNode => (
  <ProtectedLayout>
    <MainLayout>
      <TrendsLayout>{page}</TrendsLayout>
    </MainLayout>
  </ProtectedLayout>
);
