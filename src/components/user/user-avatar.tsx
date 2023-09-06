import Link from 'next/link';
import cn from 'clsx';
import { NextImage } from '@components/ui/next-image';

type UserAvatarProps = {
  src: string;
  alt: string;
  size?: number;
  id?: string;
  username?: string;
  className?: string;
};

export function UserAvatar({
  src,
  alt,
  size,
  id,
  username,
  className
}: UserAvatarProps): JSX.Element {
  const pictureSize = size ?? 48;

  return (
    <Link href={id ? `/user/${id}` : '#'}>
      <span
        className={cn(
          'blur-picture flex self-start',
          !id && 'pointer-events-none',
          className
        )}
        tabIndex={id ? 0 : -1}
      >
        <NextImage
          useSkeleton
          imgClassName={`rounded-full min-h-[${pictureSize}px]`}
          width={pictureSize}
          height={pictureSize}
          src={src}
          alt={alt}
          key={src}
        />
      </span>
    </Link>
  );
}
