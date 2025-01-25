import {FC, PropsWithChildren} from 'react';
import CloseIcon from '@mui/icons-material/Close';
import {DialogActions, DialogContent, Modal, ModalDialog, Typography, styled} from '@mui/joy';
import {StyledButton} from '@components/common/StyledButton';
import {StyledIconButton} from '@components/common/StyledIconButton';
import {glassEffect} from '@styles/commonStyles';
import styles from './styles.module.scss';

const StyledDialog = styled(ModalDialog)({
  ...glassEffect,
  minHeight: '50vh',
  minWidth: '40vw',
  borderRadius: 8,
  background: 'rgba(59,59,59,0.8)',
  boxShadow: '0 0 35px 35px rgba( 31, 38, 135, 0.37 )',
});

interface Props extends PropsWithChildren {
  open: boolean;
  title: string;
  acceptText?: string;
  onAccept?: () => void;
  onCancel?: () => void;
}

const Popup: FC<Props> = ({open, onAccept, onCancel, title, children, acceptText}) => (
  <Modal open={open} onClose={onCancel}>
    <StyledDialog>
      <div className={styles.container}>
        <Typography level="h3" className={styles.title}>
          {title}
        </Typography>
        <StyledIconButton onClick={onCancel}>
          <CloseIcon />
        </StyledIconButton>
      </div>
      <DialogContent>{children}</DialogContent>
      <DialogActions className={styles.actions}>
        {onAccept && <StyledButton onClick={onAccept}>{acceptText}</StyledButton>}
        <StyledButton onClick={onCancel}>Cancel</StyledButton>
      </DialogActions>
    </StyledDialog>
  </Modal>
);

export {Popup};
