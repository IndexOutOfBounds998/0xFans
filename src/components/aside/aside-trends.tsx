import Link from 'next/link';
import cn from 'clsx';
import { motion } from 'framer-motion';
import { formatNumber } from '@lib/date';
import { preventBubbling } from '@lib/utils';
import { Error } from '@components/ui/error';
import { HeroIcon } from '@components/ui/hero-icon';
import { Button } from '@components/ui/button';
import { ToolTip } from '@components/ui/tooltip';
import { Loading } from '@components/ui/loading';
import type { MotionProps } from 'framer-motion';
import { useTrending } from '@lib/hooks/useTrending';
import { t, Trans } from '@lingui/macro';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { loadCatalog } from 'translations/utils';
import { useLingui } from '@lingui/react';


export async function getServerSideProps(
  ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<any>> {
  // some server side logic
   console.log(1111)
  return {
    props: {
      i18n: await loadCatalog(ctx.locale as string)
    }
  };
}


export const variants: MotionProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.8 }
};

type AsideTrendsProps = {
  inTrendsPage?: boolean;
};

export function AsideTrends({ inTrendsPage }: AsideTrendsProps): JSX.Element {
  useLingui();
  const { data, loading } = useTrending({ limit: 10 });

  return (
    <section
      className={cn(
        !inTrendsPage &&
          'hover-animation rounded-2xl bg-main-sidebar-background'
      )}
    >
      {loading ? (
        <Loading />
      ) : data ? (
        <motion.div
          className={cn('inner:px-4 inner:py-3', inTrendsPage && 'mt-0.5')}
          {...variants}
        >
          {!inTrendsPage && (
            <h2 className='text-xl font-extrabold'>
              <Trans>Trends for you</Trans>
            </h2>
          )}
          {data.map(({ tag, query, tweet_volume, url }) => (
            // <Link href={url} key={query}>
            <a
              className='hover-animation accent-tab hover-card relative
                           flex cursor-not-allowed flex-col gap-0.5'
              // onClick={preventBubbling()}
            >
              <div className='absolute right-2 top-2'>
                <Button
                  className='hover-animation group relative cursor-not-allowed p-2
                               hover:bg-accent-blue/10 focus-visible:bg-accent-blue/20
                               focus-visible:!ring-accent-blue/80'
                  onClick={preventBubbling()}
                >
                  <HeroIcon
                    className='h-5 w-5 text-light-secondary group-hover:text-accent-blue
                                 group-focus-visible:text-accent-blue dark:text-dark-secondary'
                    iconName='EllipsisHorizontalIcon'
                  />
                  <ToolTip tip='More' />
                </Button>
              </div>
              {/*<p className='text-sm text-light-secondary dark:text-dark-secondary'>*/}
              {/*  Trending{' '}*/}
              {/*  {location === 'Worldwide'*/}
              {/*    ? 'Worldwide'*/}
              {/*    : `in ${location as string}`}*/}
              {/*</p>*/}
              <p className='font-bold'>{tag}</p>
              {/*<p className='text-sm text-light-secondary dark:text-dark-secondary'>*/}
              {/*  {formatNumber(tweet_volume)} tweets*/}
              {/*</p>*/}
            </a>
            // </Link>
          ))}
          {!inTrendsPage && (
            <Link href='/trends'>
              <span
                className='custom-button accent-tab hover-card block w-full rounded-2xl
                           rounded-t-none text-center text-main-accent'
              >
                Show more
              </span>
            </Link>
          )}
        </motion.div>
      ) : (
        <Error />
      )}
    </section>
  );
}

