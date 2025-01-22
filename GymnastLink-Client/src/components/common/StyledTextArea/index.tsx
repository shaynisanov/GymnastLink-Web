import {Textarea, styled} from '@mui/joy';
import {glassEffect} from '@styles/commonStyles';

const StyledTextArea = styled(Textarea)({
  ...glassEffect,
  flex: 1,
  fontSize: '1rem',
  height: 'inherit',
  padding: 12,
  resize: 'none',
});

export {StyledTextArea};
