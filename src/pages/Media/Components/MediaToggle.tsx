import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { SELECTED_MEDIA, useMedia } from '../../../Context/media.context';

const useStyles = makeStyles(() => ({
  button: {
    minWidth: 105,
  },
}));

const MediaToggle = () => {
  const { selectedMedia, setSelectedMediaType } = useMedia();

  const enableMovies =
    process.env.REACT_APP_ENABLE_MOVIES && process.env.REACT_APP_ENABLE_MOVIES.toLowerCase() === 'true';

  const classes = useStyles();

  const handleChange = (_event: React.MouseEvent<HTMLElement, MouseEvent>, newMedia: SELECTED_MEDIA) => {
    setSelectedMediaType(newMedia);
  };

  if (!enableMovies) return null;

  return (
    <ToggleButtonGroup color="primary" value={selectedMedia} exclusive onChange={handleChange}>
      <ToggleButton className={classes.button} value={SELECTED_MEDIA.SHOWS}>
        Television
      </ToggleButton>
      <ToggleButton className={classes.button} value={SELECTED_MEDIA.MOVIE}>
        Movies
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default MediaToggle;
