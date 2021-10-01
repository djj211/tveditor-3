import React from 'react';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import makeStyles from '@mui/styles/makeStyles';

import ShowResults from './ShowResults';
import { useMedia } from '../../../Context/media.context';
import { TVDBShowItem } from '../../../interfaces';
import EpisodeSetter from './EpisodeSetter';
import SearchDialog from '../../../components/SearchDialog';

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
  const { searchLoading, searchShows } = useMedia();
  const [showName, setShowName] = React.useState<string>();
  const [foundShows, setFoundShows] = React.useState<TVDBShowItem[]>([]);
  const [showResults, setShowResults] = React.useState(false);
  const [overrideStart, setOverridStart] = React.useState(false);
  const [season, setSeason] = React.useState<number>(1);
  const [episode, setEpisode] = React.useState<number>(1);

  const classes = useStyles();

  const reset = () => {
    setSeason(1);
    setEpisode(1);
  };

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
      <SearchDialog
        formName="searchForm"
        subTitle="Enter Name of Show to Perform a Search"
        open={open}
        handleClose={onClose}
        loading={searchLoading}
        onReset={reset}
      >
        <>
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
        </>
      </SearchDialog>
      <ShowResults
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
