import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import TextField from '@mui/material/TextField';
import { useHistory } from 'react-router-dom';

import LoadingButton from '../../components/LoadingButton';
import { useAuth } from '../../Context/auth.context';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 100,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 325,
    padding: '50px 20px',
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: '25px 25px',
  },
  textFields: {
    marginTop: 10,
  },
  loginBtn: {
    marginTop: 20,
    width: '50%',
    alignSelf: 'center',
    backgroundColor: theme.palette.primary.main,
    color: '#ffffff',

    '&:hover': {
      backroundColor: theme.palette.primary.light,
      color: theme.palette.primary.main,
    },
  },
}));

const Login = () => {
  const history = useHistory();
  const classes = useStyles();

  const [user, setUser] = React.useState<string>();
  const [password, setPassword] = React.useState<string>();
  const [loading, setLoading] = React.useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (user && password) {
      setLoading(true);
      const success = await login(user, password);
      setLoading(false);
      if (success) {
        history.push('/');
      }
    }
  };

  return (
    <div className={classes.root}>
      <form className={classes.form} onSubmit={(e) => handleLogin(e)}>
        <TextField
          className={classes.textFields}
          label="User"
          id="email"
          fullWidth
          onChange={(e) => setUser(e.currentTarget.value)}
          type="text"
          disabled={loading}
          required
        />
        <TextField
          className={classes.textFields}
          label="Password"
          id="password"
          fullWidth
          onChange={(e) => setPassword(e.currentTarget.value)}
          type="password"
          disabled={loading}
          required
        />
        <LoadingButton className={classes.loginBtn} loading={loading} type="submit">
          Log in
        </LoadingButton>
      </form>
    </div>
  );
};

export default Login;
