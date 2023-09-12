import { Input } from '@components/input/input';
import { Publication } from '@components/publication/publication';
import type { TweetProps } from '@components/publication/publication';

type TweetReplyModalProps = {
  tweet: TweetProps;
  closeModal: () => void;
};

export function PublicationReplyModal({
  tweet,
  closeModal
}: TweetReplyModalProps): JSX.Element {
  return (
    <Input
      modal
      replyModal
      parent={{ id: tweet?.id || '', username: tweet?.user?.username || '' }}
      closeModal={closeModal}
    >
      <Publication modal parentTweet {...tweet} />
    </Input>
  );
}
