import { memo } from 'react';
import { Skeleton } from '@mui/joy';
import { ContentCard } from '@components/common/ContentCard';

const WorkoutItemSkeleton = memo(() => (
    <ContentCard>
        <div className='display-flex gap-8px'>
            <Skeleton variant="text" width="40%" height={20} />
            <Skeleton variant="text" width="20%" height={20} />
        </div>
    </ContentCard>
));

export { WorkoutItemSkeleton as WorkoutItemSkeleton };
