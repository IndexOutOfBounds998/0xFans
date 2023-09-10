import Link from 'next/link';
import cn from 'clsx';

type UserUsernameProps = {
  id: String;
  username: string;
  className?: string;
  disableLink?: boolean;
};

export function UserUsername({
  id,
  username,
  className,
  disableLink
}: UserUsernameProps): JSX.Element {
  return (
    <Link href={`/user/${id}`}>
      <a
        className={cn(
          'truncate text-light-secondary dark:text-dark-secondary',
          className,
          disableLink && 'pointer-events-none'
        )}
        tabIndex={-1}
      >
        <>@{username}</>
      </a>
    </Link>
  );
}
