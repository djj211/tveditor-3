import React from 'react';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import LoadingButton from '../LoadingButton';
import Dialog from '../Dialog';

interface Props {
  open: boolean;
  loading: boolean;
  disabled?: boolean;
  children: React.ReactChild;
  handleSave: () => Promise<void>;
  handleOnClose: () => void;
  title?: string;
  saveText?: string;
}

const Results = ({
  open,
  loading,
  handleOnClose,
  handleSave,
  children,
  title = 'Results',
  saveText = 'Save',
  disabled,
}: Props) => {
  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      open={open}
      onClose={handleOnClose}
      aria-labelledby="max-width-dialog-title"
      style={{ zIndex: 999 }}
    >
      <DialogTitle id="max-width-dialog-title">{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={handleOnClose} disabled={disabled} color="primary">
          Cancel
        </Button>
        <LoadingButton onClick={handleSave} disabled={disabled} color="primary" loading={loading}>
          {saveText}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default Results;
