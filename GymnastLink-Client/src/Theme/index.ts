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
      fontWeight: 400,
    },
    h2: {
      fontSize: '1.75rem',
      color: commonStyles.fontColor,
      fontWeight: 400,
    },
    h3: {
      fontSize: '1.5rem',
      color: commonStyles.fontColor,
      fontWeight: 400,
    },
    h4: {
      fontSize: '1.25rem',
      color: commonStyles.fontColor,
      fontWeight: 400,
    },
    'body-lg': {
      fontSize: '1rem',
      color: commonStyles.fontColor,
      fontWeight: 400,
    },
    'body-md': {
      fontSize: '0.875rem',
      color: commonStyles.fontColor,
      fontWeight: 400,
    },
    'body-sm': {
      fontSize: '0.75rem',
      color: commonStyles.fontColor,
      fontWeight: 400,
    },
  },
});

export {theme};
