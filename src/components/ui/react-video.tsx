import React, { useEffect, useState } from 'react';
import cn from 'clsx';
import type { ReactNode } from 'react';
import ReactPlayer from 'react-player';
import { formatVideoUrl } from '@lib/FormatContent';

type ReactPlayerProps = {
  url: string;
  light?: boolean | string;
  width?: string;
  height?: string;
  children?: ReactNode;
  className?: string;
};

/**
 *
 * @description Must set width and height, if not add layout='fill'
 * @param useSkeleton add background with pulse animation, don't use it if image is transparent
 */
export function ReactVideo({
  url,
  light,
  children,
  height,
  className,
  width
}: ReactPlayerProps): JSX.Element {
  const formatUrl = formatVideoUrl(url);
  // const loading = !ReactPlayer.canPlay(formatUrl);
  const loading = false;

  return (
    <figure style={{ width, height }} className={className}>
      <ReactPlayer
        className={cn(
          className,
          loading
            ? 'animate-pulse bg-light-secondary dark:bg-dark-secondary'
            : 'object-cover'
        )}
        controls
        url={formatUrl}
        width={width}
        height={height}
        light={light}
      />
      {children}
    </figure>
  );
}
