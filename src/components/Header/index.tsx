import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

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

    return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            TV Editor
          </Typography>
          <Link variant="inherit" href={process.env.REACT_APP_DELUGE_WEB_UI_URL} target="_blank" rel="noreferrer" color="inherit">Deluge</Link>
        </Toolbar>
      </AppBar>
    </div>
    )
}

export default Header;