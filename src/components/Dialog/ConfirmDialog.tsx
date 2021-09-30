import React from 'react';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import LoadingButton from '../LoadingButton';
import Dialog from './';

interface Props {
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  open: boolean;
  title?: string;
  bodyText?: string;
  confirmText?: string;
  cancelText?: string;
}
const ConfirmDialog = ({
  open,
  onConfirm,
  onCancel,
  loading = false,
  title = 'Confim',
  bodyText = 'Are you sure',
  confirmText = 'Yes',
  cancelText = 'Cancel',
}: Props) => {
  return (
    <Dialog open={open} onClose={onCancel} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{bodyText}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary" disabled={loading}>
          {cancelText}
        </Button>
        <LoadingButton onClick={onConfirm} type="submit" color="primary" loading={loading}>
          {confirmText}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
