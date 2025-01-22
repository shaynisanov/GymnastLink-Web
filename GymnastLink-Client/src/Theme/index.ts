import {extendTheme} from '@mui/joy/styles';
import commonStyles from '@styles/palette.module.scss';

const theme = extendTheme({
  fontFamily: {
    body: 'Cairo, sans-serif',
  },
  typography: {
    h1: {
      fontSize: '2rem',
      color: commonStyles.fontColor,
    },
    h2: {
      fontSize: '1.75rem',
      color: commonStyles.fontColor,
    },
    h3: {
      fontSize: '1.5rem',
      color: commonStyles.fontColor,
    },
    'body-lg': {
      fontSize: '1rem',
      color: commonStyles.fontColor,
    },
    'body-md': {
      fontSize: '0.875rem',
      color: commonStyles.fontColor,
    },
    'body-sm': {
      fontSize: '0.75rem',
      color: commonStyles.fontColor,
    },
  },
});

export {theme};
