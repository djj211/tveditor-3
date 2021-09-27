import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { isMobileOnly } from 'react-device-detect';
import { useToasts } from 'react-toast-notifications';

import Poster from '../Poster';
import LoadingButton from '../LoadingButton';
import Dialog from '../Dialog';
import { TVDBItem } from '../../interfaces';
import { useShows } from '../../Context/shows.context';

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
  items: TVDBItem[];
  open: boolean;
  season: number;
  episode: number;
  onClose: () => void;
}

const Results = ({ items, open, season, episode, onClose }: Props) => {
  const classes = useStyles();
  const [selected, setSelected] = React.useState<TVDBItem>();
  const { addShow, editLoading } = useShows();
  const { addToast } = useToasts();

  const handleOnClose = () => {
    onClose();
    setSelected(undefined);
  };

  const onShowClick = (show: TVDBItem) => {
    if (show.id === selected?.id) {
      setSelected(undefined);
      return;
    }

    setSelected(show);
  };

  const isExistsError = (ex: any) => {
    if (ex.message !== undefined && ex.message === 'Show already exists') {
      return true;
    }
    return false;
  };

  const handleSave = async () => {
    if (selected?.name) {
      try {
        await addShow(selected.name, season, episode, selected.id);
        addToast(`Show ${selected.name} Added Successfully`, { appearance: 'success' });
      } catch (ex) {
        if (isExistsError(ex)) {
          addToast(`Show ${selected.name} already exists. Please Edit instead.`, { appearance: 'error' });
        }
      }
      handleOnClose();
    } else {
      addToast(`You must select a show!`, { appearance: 'error' });
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      open={open}
      onClose={handleOnClose}
      aria-labelledby="max-width-dialog-title"
      style={{ zIndex: 999 }}
    >
      <DialogTitle id="max-width-dialog-title">Results</DialogTitle>
      <DialogContent>
        {!items || !items.length ? (
          <div>Search Did not find any shows. Please Try again</div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className={item.id === selected?.id ? classes.selected : classes.result}
              onClick={() => onShowClick(item)}
            >
              <Poster key={item.id} image={item.image_url} width={100} imgAlt={item.name} />
              <div className={classes.textItem}>{item.name}</div>
              {!isMobileOnly && <div className={classes.textItem}>{item.network}</div>}
              {!isMobileOnly && <div className={classes.overview}>{item.overview}</div>}
            </div>
          ))
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOnClose} color="primary">
          Cancel
        </Button>
        <LoadingButton onClick={handleSave} color="primary" loading={editLoading}>
          Save
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default Results;
