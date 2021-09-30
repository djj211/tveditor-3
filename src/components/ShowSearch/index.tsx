import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import makeStyles from '@mui/styles/makeStyles';

import Results from './Results';
import { useShows } from '../../Context/shows.context';
import { TVDBItem } from '../../interfaces';
import EpisodeSetter from '../EpisodeSetter';
import LoadingButton from '../LoadingButton';
import Dialog from '../Dialog';

const useStyles = makeStyles(() => ({
  episodeSetter: {
    marginTop: 5,
  },
}));

interface Props {
  open: boolean;
  handleClose: () => void;
}

const ShowSearch = ({ open, handleClose }: Props) => {
  const { searchLoading, searchShows } = useShows();
  const [showName, setShowName] = React.useState<string>();
  const [foundShows, setFoundShows] = React.useState<TVDBItem[]>([]);
  const [showResults, setShowResults] = React.useState(false);
  const [overrideStart, setOverridStart] = React.useState(false);
  const [season, setSeason] = React.useState<number>(1);
  const [episode, setEpisode] = React.useState<number>(1);

  const classes = useStyles();

  const reset = () => {
    setSeason(1);
    setEpisode(1);
  };

  React.useEffect(() => {
    if (open) {
      reset();
    }
  }, [open]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchLoading) return;
    if (showName) {
      const shows = await searchShows(showName);
      setFoundShows(shows ?? []);
      setShowResults(true);
      onClose();
    }
  };

  const onClose = () => {
    if (searchLoading) return;
    setShowName('');
    setOverridStart(false);
    handleClose();
  };

  const onOverrideChage = () => {
    reset();
    setOverridStart(!overrideStart);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Search</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter Name of Show to Perform a Search</DialogContentText>
          <form onSubmit={(e) => onSubmit(e)} id="searchForm">
            <TextField
              autoFocus
              margin="dense"
              id="show"
              label="Show Name"
              fullWidth
              onChange={(e) => setShowName(e.currentTarget.value)}
              required
              disabled={searchLoading}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={overrideStart}
                  onChange={() => onOverrideChage()}
                  name="overrideStart"
                  color="primary"
                  disabled={searchLoading}
                />
              }
              label="Override Series Begin?"
            />
            <div className={classes.episodeSetter}>
              <EpisodeSetter
                loading={searchLoading}
                enabled={overrideStart}
                onEpisodeChange={(val) => setEpisode(val)}
                onSeasonChange={(val) => setSeason(val)}
              />
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary" disabled={searchLoading}>
            Cancel
          </Button>
          <LoadingButton type="submit" color="primary" form="searchForm" loading={searchLoading}>
            Search
          </LoadingButton>
        </DialogActions>
      </Dialog>
      <Results
        items={foundShows}
        open={showResults}
        onClose={() => setShowResults(false)}
        season={season}
        episode={episode}
      />
    </>
  );
};

export default ShowSearch;
