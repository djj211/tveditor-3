import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { isMobileOnly } from 'react-device-detect';

import SearchResults from '../../../components/SearchResults';
import { TVDBMovieItem } from '../../../interfaces';
import { useMedia } from '../../../Context/media.context';
import { useToasts } from 'react-toast-notifications';
import Poster from '../../../components/Poster';

const useStyles = makeStyles((theme) => ({
  selected: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#8bd5db',
  },
  result: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',

    '&:hover': {
      backgroundColor: '#8bd5db',
    },
  },
  overview: {
    marginLeft: 50,
  },
  textItem: {
    marginLeft: 50,
    minWidth: 150,
  },
}));

interface Props {
  open: boolean;
  items: TVDBMovieItem[];
  onClose: () => void;
}

const MovieResults = ({ items, onClose, open }: Props) => {
  const classes = useStyles();
  const [selected, setSelected] = React.useState<TVDBMovieItem>();
  const { addMovie, editLoading } = useMedia();
  const { addToast } = useToasts();

  const handleOnClose = () => {
    onClose();
    setSelected(undefined);
  };

  const onMovieClick = (movie: TVDBMovieItem) => {
    if (movie.id === selected?.id) {
      setSelected(undefined);
      return;
    }

    setSelected(movie);
  };

  const isExistsError = (ex: any) => {
    if (ex.message !== undefined && ex.message === 'Movie already exists') {
      return true;
    }
    return false;
  };

  const handleSave = async () => {
    if (selected?.name) {
      try {
        const releaseDate = new Date(selected.releaseDate);
        await addMovie(selected.name, releaseDate.getFullYear(), selected.id);
        addToast(`Movie ${selected.name} Added Successfully`, { appearance: 'success' });
      } catch (ex) {
        if (isExistsError(ex)) {
          addToast(`Movie ${selected.name} already exists. Please Edit instead.`, { appearance: 'error' });
        }
      }
      handleOnClose();
    } else {
      addToast(`You must select a movie!`, { appearance: 'error' });
    }
  };

  return (
    <SearchResults open={open} handleOnClose={handleOnClose} handleSave={handleSave} loading={editLoading}>
      <>
        {!items || !items.length ? (
          <div>Search Did not find any movies. Please Try again</div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className={item.id === selected?.id ? classes.selected : classes.result}
              onClick={() => onMovieClick(item)}
            >
              <Poster key={item.id} image={item.image_url} width={100} imgAlt={item.name} />
              <div className={classes.textItem}>{item.name}</div>
              {!isMobileOnly && <div className={classes.textItem}>{item.releaseDate}</div>}
              {!isMobileOnly && <div className={classes.overview}>{item.overview}</div>}
            </div>
          ))
        )}
      </>
    </SearchResults>
  );
};

export default MovieResults;
