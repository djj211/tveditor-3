import React from 'react';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import makeStyles from '@mui/styles/makeStyles';

import ShowResults from './ShowResults';
import { useMedia } from '../../../Context/media.context';
import { TVDBShowItem } from '../../../interfaces';
import EpisodeSetter from './EpisodeSetter';
import ActionDialog from '../../../components/ActionDialog';

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
  const [foundShows, setFoundShows] = React.useState<TVDBShowItem[]>([]);
  const [showResults, setShowResults] = React.useState(false);
  const [overrideStart, setOverridStart] = React.useState(false);
  const [season, setSeason] = React.useState<number>(1);
  const [episode, setEpisode] = React.useState<number>(1);
  const searchInputRef = React.useRef<HTMLInputElement | null>(null);

  const classes = useStyles();

  const reset = () => {
    setSeason(1);
    setEpisode(1);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (searchLoading || !searchInputRef?.current?.value) return;

    const shows = await searchShows(searchInputRef.current.value);
    setFoundShows(shows ?? []);
    setShowResults(true);
    onClose();
  };

  const onClose = () => {
    if (searchLoading) return;
    setOverridStart(false);
    handleClose();
  };

  const onOverrideChage = () => {
    reset();
    setOverridStart(!overrideStart);
  };

  return (
    <>
      <ActionDialog
        formName="searchForm"
        subTitle="Enter Name of Show to Perform a Search"
        open={open}
        handleClose={onClose}
        loading={searchLoading}
        onReset={reset}
        title="Search"
        submitButtonText="Search"
      >
        <>
          <form onSubmit={(e) => onSubmit(e)} id="searchForm">
            <TextField
              margin="dense"
              id="show"
              label="Show Name"
              fullWidth
              required
              inputRef={searchInputRef}
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
      </ActionDialog>
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
