import {memo} from 'react';
import {Input, InputProps, Typography, styled} from '@mui/joy';
import {glassEffect} from '@styles/commonStyles';
import styles from './styles.module.scss';

const CustomInput = styled(Input)({
  ...glassEffect,
  padding: 8,
});

interface Props extends InputProps {
  inputLabel?: string;
}

const StyledInput = memo<Props>(({inputLabel, ...props}) => (
  <div className={styles.container}>
    {inputLabel && <Typography level="body-md">{inputLabel}</Typography>}
    <CustomInput {...props} />
  </div>
));

export type {Props as StyledInputProps};
export {StyledInput};
