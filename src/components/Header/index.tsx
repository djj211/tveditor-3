import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

import { useAuth } from "../../Context/auth.context";

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    title: {
      flexGrow: 1,
    },
}));

const Header = () => {
    const classes = useStyles();
    const { isAuthenticated } = useAuth();

    return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            TV Editor
          </Typography>
          {isAuthenticated && <Link variant="inherit" href={process.env.REACT_APP_DELUGE_WEB_UI_URL} target="_blank" rel="noreferrer" color="inherit">Deluge</Link>}
        </Toolbar>
      </AppBar>
    </div>
    )
}

export default Header;