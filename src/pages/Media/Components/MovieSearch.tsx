import React from 'react';
import TextField from '@mui/material/TextField';

import { useMedia } from '../../../Context/media.context';
import { TVDBMovieItem } from '../../../interfaces';
import ActionDialog from '../../../components/ActionDialog';
import MovieResults from './MovieResults';

interface Props {
  open: boolean;
  handleClose: () => void;
}

const MovieSearch = ({ open, handleClose }: Props) => {
  const { searchLoading, searchMovies } = useMedia();
  const [foundMovies, setFoundMovies] = React.useState<TVDBMovieItem[]>([]);
  const [showResults, setShowResults] = React.useState(false);
  const searchInputRef = React.useRef<HTMLInputElement | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (searchLoading || !searchInputRef?.current?.value) return;

    const movies = await searchMovies(searchInputRef.current.value);
    setFoundMovies(movies ?? []);
    setShowResults(true);
    onClose();
  };

  const onClose = () => {
    if (searchLoading) return;

    handleClose();
  };

  return (
    <>
      <ActionDialog
        formName="searchForm"
        subTitle="Enter Name of Movie to Perform a Search"
        open={open}
        handleClose={onClose}
        loading={searchLoading}
        title="Search"
        submitButtonText="Search"
      >
        <>
          <form onSubmit={(e) => onSubmit(e)} id="searchForm">
            <TextField
              margin="dense"
              id="movie"
              label="Movie Name"
              fullWidth
              required
              disabled={searchLoading}
              inputRef={searchInputRef}
            />
          </form>
        </>
      </ActionDialog>
      <MovieResults items={foundMovies} open={showResults} onClose={() => setShowResults(false)} />
    </>
  );
};

export default MovieSearch;
