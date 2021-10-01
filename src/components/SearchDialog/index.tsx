import React from 'react';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import LoadingButton from '../LoadingButton';
import Dialog from '../Dialog';
import DialogContentText from '@mui/material/DialogContentText/DialogContentText';

interface Props {
  formName: string;
  loading: boolean;
  subTitle: string;
  children: React.ReactChild;
  open: boolean;
  handleClose: () => void;
  onReset?: () => void;
}

const Search = ({ formName, open, handleClose, children, onReset, loading, subTitle }: Props) => {
  React.useEffect(() => {
    if (open && onReset) {
      onReset();
    }
  }, [open, onReset]);

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Search</DialogTitle>
      <DialogContent>
        <DialogContentText>{subTitle}</DialogContentText>
        {children}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" disabled={loading}>
          Cancel
        </Button>
        <LoadingButton type="submit" color="primary" form={formName} loading={loading}>
          Search
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default Search;
