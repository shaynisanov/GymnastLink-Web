import {FC, PropsWithChildren, ReactNode} from 'react';
import CloseIcon from '@mui/icons-material/Close';
import {DialogActions, DialogContent, Modal, ModalDialog, Typography, styled} from '@mui/joy';
import {StyledButton} from '@components/common/StyledButton';
import {StyledIconButton} from '@components/common/StyledIconButton';
import {glassEffect} from '@styles/commonStyles';
import styles from './styles.module.scss';

const StyledDialog = styled(ModalDialog)({
  ...glassEffect,
  minWidth: '40vw',
  borderRadius: 8,
  background: 'rgba(59,59,59,0.8)',
  boxShadow: '0 0 35px 35px rgba( 31, 38, 135, 0.37 )',
});

interface Props extends PropsWithChildren {
  open: boolean;
  title: string;
  acceptAction?: ReactNode;
  onCancel?: () => void;
}

const Popup: FC<Props> = ({open, acceptAction, onCancel, title, children}) => (
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
        {acceptAction}
        <StyledButton onClick={onCancel}>Cancel</StyledButton>
      </DialogActions>
    </StyledDialog>
  </Modal>
);

export {Popup};
