import { ContentCard } from "@components/common/ContentCard";
import styles from './styles.module.scss';
import WorkoutItem from "../WorkoutItem";
import { Workout } from "@customTypes/Workout";
import { FC } from "react";
import { compareDesc } from "date-fns";
import { WorkoutItemSkeleton } from "../WorkoutItem/WorkoutItemSkeleton";

interface Props {
    workouts: Workout[];
    showLoading: boolean;
    onWorkoutClick: (workout: Workout) => void;
}

const WorkoutList: FC<Props> = ({ workouts, showLoading, onWorkoutClick }) => {
    return (
        <ContentCard>
            <div className={styles.container}>
                {showLoading
                    ? Array.from({ length: 5 }).map((_, index) => <WorkoutItemSkeleton key={index} />)
                    : workouts?.sort((a, b) => compareDesc(a.createdTime, b.createdTime))
                        .map((workout) =>
                            <WorkoutItem
                                workout={workout}
                                key={workout._id}
                                onClick={() => onWorkoutClick(workout)} />)}
            </div>
        </ContentCard>
    );
}

export default WorkoutList;