import { useUser } from '@lib/context/user-context';
import { SEO } from '@components/common/seo';
import { UserCards } from '@components/user/user-cards';
import { UserCardProps } from '@lib/hooks/useCollection';
import { useUserFollowerCollection } from '@lib/hooks/useUserFollowerCollection';
import { profileId } from '@lens-protocol/react-web';


type UserFollowProps = {
  type: 'following' | 'followers';
  id: string;
};


export function UserFollower({ type, id }: UserFollowProps): JSX.Element {
  const { user } = useUser();

  const { name, username } = user as UserCardProps;

  const { data, loading } = useUserFollowerCollection<UserCardProps>(
    {
      limit: 10,
      profileId: profileId(id),
      observerId: profileId(user?.id as string)
    }
  );

  return (
    <>
      <SEO
        title={`People ${type === 'following' ? 'followed by' : 'following'
          } ${name} (@${username}) / 0xFans`}
      />
      <UserCards follow data={data} type={type} loading={loading} />
    </>
  );
}
