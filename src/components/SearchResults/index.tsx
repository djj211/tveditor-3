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
  children: React.ReactChild;
  handleSave: () => Promise<void>;
  handleOnClose: () => void;
}

const Results = ({ open, loading, handleOnClose, handleSave, children }: Props) => {
  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      open={open}
      onClose={handleOnClose}
      aria-labelledby="max-width-dialog-title"
      style={{ zIndex: 999 }}
    >
      <DialogTitle id="max-width-dialog-title">Results</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={handleOnClose} color="primary">
          Cancel
        </Button>
        <LoadingButton onClick={handleSave} color="primary" loading={loading}>
          Save
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default Results;
