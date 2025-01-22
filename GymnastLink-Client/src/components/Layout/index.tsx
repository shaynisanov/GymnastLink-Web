import {FC} from 'react';
import {Outlet} from 'react-router';
import {NavBar} from '@components/Navbar';
import styles from './styles.module.scss';

const Layout: FC = () => (
  <>
    <NavBar />
    <div className={styles.contentContainer}>
      <Outlet />
    </div>
  </>
);

export {Layout};
