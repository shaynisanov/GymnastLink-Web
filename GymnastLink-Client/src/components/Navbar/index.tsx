import {FC} from 'react';
import {Link, useLocation} from 'react-router';
import {Typography} from '@mui/joy';
import {ClientRoutes} from '@enums/clientRoutes';
import {MenuItem} from '../../types/menuItem';
import styles from './styles.module.scss';

const pages: MenuItem[] = [
  {
    text: 'Updates',
    route: ClientRoutes.UPDATES,
  },
  {
    text: 'Workouts',
    route: ClientRoutes.WORKOUTS,
  },
  {
    text: 'Profile',
    route: ClientRoutes.PROFILE,
  },
];

const NavBar: FC = () => {
  const location = useLocation();
  const currentRoute = location.pathname;

  return (
    <div className={styles.container}>
      <Typography component="a" href="/" className={styles.title}>
        GymnastLink
      </Typography>
      <div className={styles.linksContainer}>
        {pages.map((page) => (
          <Link key={page.route}
                to={page.route}
                className={currentRoute === page.route ? styles.activePageText : styles.pageText}>
            <Typography className={currentRoute === page.route ? styles.activePageText : styles.pageText}>
              {page.text}
            </Typography>
          </Link>
        ))}
      </div>
    </div>
  );
};
export {NavBar};
