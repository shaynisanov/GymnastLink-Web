import {IconButton, styled} from '@mui/joy';
import commonStyles from '@styles/palette.module.scss';

const StyledIconButton = styled(IconButton)({
  display: 'flex',
  gap: 6,
  alignItems: 'center',
  transition: 'background-color 0.2s',
  '> svg': {
    fill: commonStyles.fontColor,
  },
  '&:hover': {
    '> svg': {
      fill: 'black',
    },
    p: {
      color: 'black',
    },
  },
});

export {StyledIconButton};
