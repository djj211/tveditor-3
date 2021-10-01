import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import TextField from '@mui/material/TextField';
import { format } from 'date-fns';
import Typography from '@mui/material/Typography';
import { useToasts } from 'react-toast-notifications';

import EpisodeSetter from './EpisodeSetter';
import { Show } from '../../../interfaces';
import Poster from '../../../components/Poster';
import ItemEditor from '../../../components/ItemEditor';
import InfoItem from '../../../components/InfoItem';

import { useMedia } from '../../../Context/media.context';

const useStyles = makeStyles((theme) => ({
  overviewContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  overviewText: {
    margin: '0, 20px',
  },
  updateForm: {
    display: 'flex',
    alignItems: 'center',
  },
  canceledText: {
    color: 'red',
  },
}));

interface Props {
  item: Show;
  open: boolean;
  handleClose: () => void;
}

const ShowEditor = ({ item, open, handleClose }: Props) => {
  const classes = useStyles();
  const [season, setSeason] = React.useState<number>();
  const [episode, setEpisode] = React.useState<number>();
  const [name, setName] = React.useState<string>();

  const { deleteShow, editShow, editLoading, deleteLoading } = useMedia();
  const { addToast } = useToasts();

  React.useEffect(() => {
    setSeason(item.tvdb.nextEpisode?.season);
    setEpisode(item.tvdb.nextEpisode?.number);
    setName(item.flexget.name);
  }, [item]);

  const onClose = () => {
    if (editLoading) return;
    setSeason(undefined);
    setEpisode(undefined);
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
    <ItemEditor
      formName="showForm"
      title={item.flexget.name}
      open={open}
      handleClose={onClose}
      onDelete={doDelete}
      editLoading={editLoading}
      deleteLoading={deleteLoading}
      deleteTitle={`Delete ${item.flexget.name}?`}
      deleteMsg={`Are you sure you want to delete ${item.flexget.name}?`}
    >
      <>
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
      </>
    </ItemEditor>
  );
};

export default ShowEditor;
