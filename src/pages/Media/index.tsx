import React from 'react';
import { Container } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import CircularProgress from '@mui/material/CircularProgress';

import Actions from './Components/Actions';
import Shows from './Components/Shows';
import Movies from './Components/Movies';
import MediaToggle from './Components/MediaToggle';
import { SELECTED_MEDIA, useMedia } from '../../Context/media.context';
import ShowSearch from './Components/ShowSearch';
import MovieSearch from './Components/MovieSearch';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 10,
    padding: 0,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: theme.palette.primary.main,
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    height: '100vh',
    alignItems: 'center',
    marginTop: -150,
  },
}));

const Media = () => {
  const [searchOpen, setSearchOpen] = React.useState(false);
  const { refreshLoading, refreshShows, selectedMedia } = useMedia();

  const classes = useStyles();

  const onClick = () => {
    setSearchOpen(true);
  };

  React.useEffect(() => {
    refreshShows();
  }, [refreshShows]);

  return (
    <>
      <Container className={classes.root} maxWidth="lg">
        <div className={classes.header}>
          <MediaToggle />
        </div>
        {refreshLoading ? (
          <div className={classes.loading}>
            <CircularProgress size={80} />
          </div>
        ) : (
          <>{selectedMedia === SELECTED_MEDIA.SHOWS ? <Shows /> : <Movies />}</>
        )}
        <Actions onAddClick={onClick} />
      </Container>
      {selectedMedia === SELECTED_MEDIA.SHOWS ? (
        <ShowSearch open={searchOpen} handleClose={() => setSearchOpen(false)} />
      ) : (
        <MovieSearch open={searchOpen} handleClose={() => setSearchOpen(false)} />
      )}
    </>
  );
};

export default Media;
