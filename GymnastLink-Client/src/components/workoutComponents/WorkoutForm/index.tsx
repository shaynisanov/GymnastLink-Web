import { FC } from 'react';
import { ContentCard } from '@components/common/ContentCard';
import { StyledButton } from '@components/common/StyledButton';
import styles from './styles.module.scss';

interface Props {
    buttonText: string;
    workoutDescription: string;
    handleButtonClick: () => Promise<void>;
}

const WorkoutForm: FC<Props> = ({ buttonText, workoutDescription, handleButtonClick }) => {
    return (
        <ContentCard>
            <div className={styles.contentContainer}>
                <ContentCard>
                    {workoutDescription}
                </ContentCard>
                <div className={styles.buttonContainer}>
                    <StyledButton onClick={async () => await handleButtonClick()}>
                        {buttonText}
                    </StyledButton>
                </div>
            </div>
        </ContentCard>
    );
};

export default WorkoutForm;