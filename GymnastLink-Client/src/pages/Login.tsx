import {getUserData} from '@services/api';
import Cookies from 'js-cookie';
import {FC, useEffect} from 'react';
import {useNavigate} from 'react-router';
import {Typography} from '@mui/joy';
import {LoginForm} from '@components/LoginForm';
import {ContentCard} from '@components/common/ContentCard';
import {useUserContext} from '@contexts/UserContext';
import {ClientRoutes} from '@enums/clientRoutes';
import styles from '@styles/login.module.scss';

const Login: FC = () => {
  const {user, setUser} = useUserContext();
  const navigate = useNavigate();
  const token = Cookies.get('access_token');

  useEffect(() => {
    if (token) {
      if (!user) {
        getUserData().then((userData) => {
          setUser(userData);
          navigate(ClientRoutes.UPDATES);
        });
      } else {
        navigate(ClientRoutes.UPDATES);
      }
    }
  }, [user, token]);

  return (
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
};

export default Login;
