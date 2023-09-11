type UserFollowingProps = {
  isFollowingbserver?: boolean;
};

export function UserFollowing({
  isFollowingbserver
}: UserFollowingProps): JSX.Element | null {
  if (!isFollowingbserver) return null;

  return (
    <p className='rounded bg-main-search-background px-1 text-xs'>
      Follows you
    </p>
  );
}
