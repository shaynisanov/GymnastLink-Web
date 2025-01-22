import {MenuItem} from '@customTypes/menuItem';
import {ClientRoutes} from '@enums/clientRoutes';

const menuItems: MenuItem[] = [
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

export {menuItems};
