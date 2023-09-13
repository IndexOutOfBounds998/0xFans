import Head from 'next/head';

export function AppHead(): JSX.Element {
  return (
    <Head>
      <title>0xFans</title>
      <meta name='og:title' content='0xFansProtocol' />
      <link rel='icon' href='/favicon.ico' />
      <link rel='manifest' href='/site.webmanifest' key='site-manifest' />
      <meta name='twitter:site' content='@0xFansProtocol' />
      <meta name='twitter:card' content='summary_large_image' />
    </Head>
  );
}
