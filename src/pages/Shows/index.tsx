import React from 'react';
import { Container, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import CircularProgress from '@mui/material/CircularProgress';

import { useShows } from '../../Context/shows.context';
import ShowSearch from '../../components/ShowSearch';
import ConfiguredItem from '../../components/ConfiguredItem';
import Actions from './Components/Actions';
import MediaToggle from './Components/MediaToggle';

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
  showsContainer: {
    marginTop: 10,
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, max-content))',
    padding: 'initial',
    display: 'grid',
    justifyContent: 'center',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    height: '100vh',
    alignItems: 'center',
    marginTop: -150,
  },
}));

const Shows = () => {
  const [searchOpen, setSearchOpen] = React.useState(false);
  const { shows, refreshShows, refreshLoading } = useShows();
  const classes = useStyles();

  React.useEffect(() => {
    refreshShows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClick = () => {
    setSearchOpen(true);
  };

  return (
    <>
      <Container className={classes.root} maxWidth="lg">
        <div className={classes.header}>
          <MediaToggle />
          <Typography variant="h4">Manage Shows</Typography>
        </div>
        {refreshLoading ? (
          <div className={classes.loading}>
            <CircularProgress size={80} />
          </div>
        ) : (
          <>
            <div className={classes.showsContainer}>
              {shows?.map((show) => (
                <ConfiguredItem key={show.flexget.id} item={show} />
              ))}
            </div>
            <Actions onAddClick={onClick} />
          </>
        )}
      </Container>
      <ShowSearch open={searchOpen} handleClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Shows;
