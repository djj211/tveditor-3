import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const useStyles = makeStyles(() => ({
  button: {
    minWidth: 105,
  },
}));

const MediaToggle = () => {
  const enableMovies =
    process.env.REACT_APP_ENABLE_MOVIES && process.env.REACT_APP_ENABLE_MOVIES.toLowerCase() === 'true';

  const classes = useStyles();
  const [alignment, setAlignment] = React.useState('tv');

  const handleChange = (_event: React.MouseEvent<HTMLElement, MouseEvent>, newAlignment: string) => {
    setAlignment(newAlignment);
  };

  if (!enableMovies) return null;

  return (
    <ToggleButtonGroup color="primary" value={alignment} exclusive onChange={handleChange}>
      <ToggleButton className={classes.button} value="tv">
        Television
      </ToggleButton>
      <ToggleButton className={classes.button} value="movies">
        Movies
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default MediaToggle;
