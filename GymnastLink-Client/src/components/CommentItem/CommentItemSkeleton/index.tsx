import {memo} from 'react';
import {Skeleton} from '@mui/joy';
import {ContentCard} from '@components/common/ContentCard';
import {UserSkeleton} from '@components/common/UserSkeleton';

const CommentItemSkeleton = memo(() => (
  <ContentCard>
    <UserSkeleton />
    <Skeleton variant="text" width="100%" height={20} />
  </ContentCard>
));

export {CommentItemSkeleton};
