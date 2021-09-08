import React from "react";
import MaterialDialog, { DialogProps } from '@material-ui/core/Dialog';

const Dialog = (props: DialogProps) => (
    <MaterialDialog
    {...props}
    style={{zIndex: 999}}
    >
      {props.children}
    </MaterialDialog>
);

export default Dialog;