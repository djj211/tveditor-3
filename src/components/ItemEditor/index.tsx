import React from 'react';
import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { format } from 'date-fns';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { useToasts } from 'react-toast-notifications';

import EpisodeSetter from '../EpisodeSetter';
import { Show } from '../../interfaces';
import Poster from '../Poster';
import Dialog from '../Dialog';
import LoadingButton from '../LoadingButton';
import ConfirmDialog from '../Dialog/ConfirmDialog';
import { useShows } from '../../Context/shows.context';

const useStyles = makeStyles((theme) => ({
  overviewContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  overviewText: {
    margin: '0, 20px',
  },
  infoItem: {
    marginTop: 5,
  },
  updateForm: {
    display: 'flex',
    alignItems: 'center',
  },
  showInput: {
    width: 60,
    marginRight: 10,
  },
  canceledText: {
    color: 'red',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

interface Props {
  item: Show;
  open: boolean;
  handleClose: () => void;
}

const ItemEditor = ({ item, open, handleClose }: Props) => {
  const classes = useStyles();
  const [season, setSeason] = React.useState<number>();
  const [episode, setEpisode] = React.useState<number>();
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [name, setName] = React.useState<string>();

  const { deleteShow, editShow, editLoading, deleteLoading } = useShows();
  const { addToast } = useToasts();

  React.useEffect(() => {
    setSeason(item.tvdb.nextEpisode?.season);
    setEpisode(item.tvdb.nextEpisode?.number);
    setName(item.flexget.name);
  }, [item]);

  const InfoItem = ({ label, value, color }: { label: string; value: string; color?: string }) => {
    return (
      <div className={classes.infoItem}>
        <Typography variant="h6">{label}</Typography>
        <div style={{ color: color ? color : '' }}>{value}</div>
      </div>
    );
  };

  const onClose = () => {
    if (editLoading) return;
    setSeason(undefined);
    setEpisode(undefined);
    setConfirmOpen(false);
    handleClose();
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (season && episode && name && !editLoading) {
      await editShow(item.flexget.id, name, season, episode, item.tvdb.id);
      addToast(`Show ${item.flexget.name} Saved Successfully`, { appearance: 'success' });
      handleClose();
    }
  };

  const doDelete = async () => {
    const name = item.flexget.name;
    await deleteShow(item.flexget.id, item.flexget.name);
    addToast(`Show ${name} Deleted Successfully`, { appearance: 'success' });
    handleClose();
  };

  const formatEpisodeText = (season?: number, episode?: number, date?: string) => {
    if (season && episode) {
      const ret = `Season ${season}
                        Episode ${episode}`;
      if (date) {
        return `${ret} on ${format(new Date(date), 'MM/dd/yyyy')}`;
      }

      return ret;
    } else {
      return 'None Yet';
    }
  };

  const getNextUpText = (status: string, airDate?: string): React.ReactNode => {
    if (status !== 'Continuing') {
      return <span className={classes.canceledText}>NOTE: This Show has been Canceled</span>;
    }
    if (airDate) {
      return `On ${format(new Date(airDate), 'MM/dd/yyyy')}`;
    }
    return '';
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          {item.flexget.name}
          <IconButton aria-label="close" disabled={editLoading} className={classes.closeButton} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div className={classes.overviewContainer}>
            <Poster image={item.tvdb.image_url} width={100} imgAlt={item.flexget.name} />
            <div className={classes.overviewText}>{item.tvdb.overview}</div>
          </div>
          <InfoItem
            label="Previously Set Start Value"
            value={formatEpisodeText(item.flexget.begin_episode?.season, item.flexget.begin_episode?.number)}
          />
          <InfoItem
            label="Last Downloaded"
            value={formatEpisodeText(
              item.flexget.latest_entity?.season,
              item.flexget.latest_entity?.number,
              item.flexget.latest_entity?.first_seen,
            )}
          />
          <InfoItem
            label="Last Aired"
            value={formatEpisodeText(
              item.tvdb.latestEpisode?.season,
              item.tvdb.latestEpisode?.number,
              item.tvdb.latestEpisode?.airDate,
            )}
          />
          <InfoItem label="Status" value={item.tvdb.status} color={item.tvdb.status !== 'Continuing' ? 'red' : ''} />
          <Typography variant="h6">Next Up</Typography>
          <form onSubmit={(e) => onSubmit(e)} id="showForm">
            <div className={classes.updateForm}>
              <EpisodeSetter
                defaultSeasonVal={item.tvdb.status !== 'Continuing' ? '' : item.tvdb.nextEpisode?.season}
                defaultEpisodeVal={item.tvdb.status !== 'Continuing' ? '' : item.tvdb.nextEpisode?.number}
                onEpisodeChange={(val) => setEpisode(val)}
                onSeasonChange={(val) => setSeason(val)}
                loading={editLoading}
              />
              <div>{getNextUpText(item.tvdb.status, item.tvdb.nextEpisode?.airDate)}</div>
            </div>
            <Typography variant="h6">Override TVDB Name</Typography>
            <TextField
              autoFocus
              margin="dense"
              id="show"
              label="Show Name"
              fullWidth
              onChange={(e) => setName(e.currentTarget.value)}
              required
              defaultValue={item.flexget.name}
              disabled={editLoading}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <LoadingButton type="submit" color="primary" form="showForm" loading={editLoading}>
            Update
          </LoadingButton>
          <Button color="primary" onClick={() => setConfirmOpen(true)}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <ConfirmDialog
        open={confirmOpen}
        onConfirm={doDelete}
        onCancel={onClose}
        loading={deleteLoading}
        title={`Delete ${item.flexget.name}?`}
        bodyText={`Are you sure you want to delete ${item.flexget.name}?`}
        confirmText="Delete"
        cancelText={'Cancel'}
      />
    </>
  );
};

export default ItemEditor;
