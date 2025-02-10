import {FC, useCallback, useMemo, useState} from 'react';
import {CheckRounded} from '@mui/icons-material';
import {Typography} from '@mui/joy';
import {Popup} from '@components/common/Popup';
import {StyledButton} from '@components/common/StyledButton';
import {StyledInput} from '@components/common/input/StyledInput';
import {useUserContext} from '@contexts/UserContext';
import styles from './styles.module.scss';

interface Props {
  open: boolean;
  onSubmit: (newUserName: string) => void;
  onClose: () => void;
}

const EditUsernamePopup: FC<Props> = ({open, onSubmit, onClose}) => {
  const {user} = useUserContext();
  const [newUsername, setNewUsername] = useState(user?.userName);

  const isNewUsernameValid = useMemo(
    () => open && newUsername !== user?.userName && !!newUsername?.trim(),
    [open, newUsername, user?.userName]
  );

  const handleSubmit = useCallback(() => {
    if (newUsername && isNewUsernameValid) {
      onSubmit(newUsername);
    }
  }, [newUsername, onSubmit, isNewUsernameValid]);

  return (
    <Popup
      open={open}
      title="Edit Username"
      acceptAction={
        <StyledButton onClick={handleSubmit} disabled={!isNewUsernameValid} startDecorator={<CheckRounded />}>
          Update
        </StyledButton>
      }
      onCancel={onClose}>
      <div className={styles.container}>
        <Typography>Pick a new userName that will describe you. Press Update when you found one.</Typography>
        <StyledInput
          className={styles.input}
          placeholder="New Username"
          value={newUsername}
          onChange={e => setNewUsername(e.target.value)}
        />
      </div>
    </Popup>
  );
};

export {EditUsernamePopup};
