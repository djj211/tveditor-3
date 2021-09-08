import React from "react";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";

import LoadingButton from "../LoadingButton";
import Dialog from "./";

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
const ConfirmDialog = ({ open, onConfirm, onCancel, loading = false, title = "Confim", bodyText = "Are you sure", confirmText = "Yes", cancelText = "Cancel" }: Props) => {
    return (
        <Dialog open={open} onClose={onCancel} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">{title}</DialogTitle>
          <DialogContent>
            <DialogContentText>
                {bodyText}
            </DialogContentText>
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
    )
}

export default ConfirmDialog;