import {Button, styled} from '@mui/joy';
import commonStyles from '@styles/palette.module.scss';

const StyledButton = styled(Button)({
  borderRadius: 8,
  padding: '8px 16px',
  color: commonStyles.fontColor,
  fontSize: 14,
  fontWeight: 400,
  backgroundColor: 'rgba(44, 44, 44, 0.5)',
  border: 'solid',
  borderWidth: 1,
  borderColor: '#2C2C2C',
  transition: 'color 0.3s, background-color 0.3s, border-color 0.3s',
  '&:hover': {
    backgroundColor: commonStyles.fontColor,
    color: '#2C2C2C',
    borderColor: commonStyles.fontColor,
  },
});

export {StyledButton};
