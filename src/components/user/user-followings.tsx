import { useUser } from '@lib/context/user-context';
import { useCollection } from '@lib/hooks/useCollection';
import { SEO } from '@components/common/seo';
import { UserCards } from '@components/user/user-cards';
import { UserCardProps } from '@lib/hooks/useCollection';
import { useUserFollowingCollection } from '@lib/hooks/useUserFollowingCollection';
import { profileId } from '@lens-protocol/react-web';
import { useProfile } from '@lens-protocol/react-web';

type UserFollowProps = {
  type: 'following' | 'followers';
  id: string;
};


export function UserFollowings({ type, id }: UserFollowProps): JSX.Element {
  const { user } = useUser();

  const { name, username, id: userId } = user as UserCardProps;

  const { data: profile, loading: useProfileLoading } = useProfile({ profileId: profileId(id) });

  const { data, loading } = useUserFollowingCollection<UserCardProps>({
    limit: 10,
    observerId: profileId(userId as string),
    walletAddress: profile?.ownedBy || ''
  });

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
