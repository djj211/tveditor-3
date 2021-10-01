import React from 'react';
import makeStyles from '@mui/styles/makeStyles';

import { useMedia } from '../../../Context/media.context';
import Item from './Item';

const useStyles = makeStyles((theme) => ({
  showsContainer: {
    marginTop: 10,
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, max-content))',
    padding: 'initial',
    display: 'grid',
    justifyContent: 'center',
  },
}));

const Shows = () => {
  const { movies } = useMedia();
  const classes = useStyles();

  return (
    <div className={classes.showsContainer}>
      {movies?.map((movie) => (
        <Item key={movie.flexget.id} item={movie} />
      ))}
    </div>
  );
};

export default Shows;
