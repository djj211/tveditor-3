import React from 'react';
import MaterialDialog, { DialogProps } from '@mui/material/Dialog';

const Dialog = (props: DialogProps) => (
  <MaterialDialog {...props} style={{ zIndex: 999 }}>
    {props.children}
  </MaterialDialog>
);

export default Dialog;
