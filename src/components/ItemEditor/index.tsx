import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Dialog from '../Dialog';
import LoadingButton from '../LoadingButton';
import ConfirmDialog from '../Dialog/ConfirmDialog';

const useStyles = makeStyles((theme) => ({
  overviewContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  overviewText: {
    margin: '0, 20px',
  },
  infoItem: {
    marginTop: 5,
  },
  updateForm: {
    display: 'flex',
    alignItems: 'center',
  },
  showInput: {
    width: 60,
    marginRight: 10,
  },
  canceledText: {
    color: 'red',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

interface Props {
  formName: string;
  editLoading: boolean;
  deleteLoading: boolean;
  children: React.ReactChild;
  title: string;
  open: boolean;
  deleteTitle: string;
  deleteMsg: string;
  handleClose: () => void;
  onDelete: () => Promise<void>;
}

const ItemEditor = ({
  formName,
  children,
  title,
  open,
  handleClose,
  onDelete,
  editLoading,
  deleteLoading,
  deleteTitle,
  deleteMsg,
}: Props) => {
  const classes = useStyles();
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const onClose = () => {
    if (editLoading || deleteLoading) return;
    setConfirmOpen(false);
    handleClose();
  };

  const onCancel = () => {
    setConfirmOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          {title}
          <IconButton
            aria-label="close"
            disabled={editLoading || deleteLoading}
            className={classes.closeButton}
            onClick={onClose}
            size="large"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <LoadingButton disabled={deleteLoading} type="submit" color="primary" form={formName} loading={editLoading}>
            Update
          </LoadingButton>
          <Button disabled={deleteLoading || editLoading} color="primary" onClick={() => setConfirmOpen(true)}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <ConfirmDialog
        open={confirmOpen}
        onConfirm={onDelete}
        onCancel={onCancel}
        loading={deleteLoading}
        title={deleteTitle}
        bodyText={deleteMsg}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
};

export default ItemEditor;
