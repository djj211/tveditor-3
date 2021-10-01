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
  const { shows } = useMedia();
  const classes = useStyles();

  return (
    <div className={classes.showsContainer}>
      {shows?.map((show) => (
        <Item key={show.flexget.id} item={show} />
      ))}
    </div>
  );
};

export default Shows;
