import { useUser } from '@lib/context/user-context';
import { useCollection } from '@lib/hooks/useCollection';
import { SEO } from '@components/common/seo';
import { UserCards } from '@components/user/user-cards';
import { UserCardProps } from '@lib/hooks/useCollection';

type UserFollowProps = {
  type: 'following' | 'followers';
};

export function UserFollow({ type }: UserFollowProps): JSX.Element {
  const { user } = useUser();

  const { name, username } = user as UserCardProps;

  const { data, loading, LoadMore } = useCollection<UserCardProps>();

  return (
    <>
      <SEO
        title={`People ${
          type === 'following' ? 'followed by' : 'following'
        } ${name} (@${username}) / 0xFans`}
      />
      <UserCards
        follow
        data={data}
        type={type}
        loading={loading}
        LoadMore={LoadMore}
      />
    </>
  );
}
