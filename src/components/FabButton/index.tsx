import React from "react";
import { makeStyles } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';

const useStyles = makeStyles(() => ({
    root: {
        position: "sticky",
        bottom: 10,
        float: "right"
    }
}));

interface Props {
    children: React.ReactChild
    onClick: () => void;
}

const FabButton = ({children, onClick}: Props) => {
    const classes = useStyles();

    return (
      <div className={classes.root}>
        <Fab color="primary" aria-label="add" onClick={onClick}>
          {children}
        </Fab>
      </div>
    )
}

export default FabButton;