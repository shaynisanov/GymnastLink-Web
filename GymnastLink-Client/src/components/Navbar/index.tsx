import {FC} from 'react';
import {Link, useLocation} from 'react-router';
import {Typography} from '@mui/joy';
import {menuItems} from '@components/Navbar/menuItems';
import {glassEffect} from '@styles/commonStyles';
import styles from './styles.module.scss';

const NavBar: FC = () => {
  const location = useLocation();
  const currentRoute = location.pathname;

  return (
    <div style={glassEffect} className={styles.container}>
      <Typography level="h2" component="a" href="/" className={styles.title}>
        GymnastLink
      </Typography>
      <div className={styles.linksContainer}>
        {menuItems.map((item) => (
          <Link
            key={item.route}
            to={item.route}
            className={currentRoute === item.route ? styles.activePageText : styles.pageText}
          >
            <Typography
              level="body-lg"
              className={currentRoute === item.route ? styles.activePageText : styles.pageText}
            >
              {item.text}
            </Typography>
          </Link>
        ))}
      </div>
    </div>
  );
};
export {NavBar};
