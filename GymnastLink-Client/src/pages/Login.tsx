import {FC} from 'react';
import {Typography} from '@mui/joy';
import {LoginForm} from '@components/LoginForm';
import {ContentCard} from '@components/common/ContentCard';
import styles from '@styles/login.module.scss';

const Login: FC = () => (
  <div className={styles.container}>
    <ContentCard>
      <div className={styles.cardContainer}>
        <div className={styles.titleContainer}>
          <Typography level="h1" fontSize="3rem">
            GymnastLink
          </Typography>
          <Typography level="h4" fontWeight={100}>
            Another reason to workout.
          </Typography>
        </div>
        <LoginForm />
      </div>
    </ContentCard>
  </div>
);

export default Login;
