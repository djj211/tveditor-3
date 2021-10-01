import React from 'react';
import TextField from '@mui/material/TextField';

import { useMedia } from '../../../Context/media.context';
import { TVDBMovieItem } from '../../../interfaces';
import SearchDialog from '../../../components/SearchDialog';
import MovieResults from './MovieResults';

interface Props {
  open: boolean;
  handleClose: () => void;
}

const MovieSearch = ({ open, handleClose }: Props) => {
  const { searchLoading, searchMovies } = useMedia();
  const [movieName, setMovieName] = React.useState<string>();
  const [foundMovies, setFoundMovies] = React.useState<TVDBMovieItem[]>([]);
  const [showResults, setShowResults] = React.useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchLoading) return;
    if (movieName) {
      const movies = await searchMovies(movieName);
      setFoundMovies(movies ?? []);
      setShowResults(true);
      onClose();
    }
  };

  const onClose = () => {
    if (searchLoading) return;
    setMovieName('');
    handleClose();
  };

  return (
    <>
      <SearchDialog
        formName="searchForm"
        subTitle="Enter Name of Movie to Perform a Search"
        open={open}
        handleClose={onClose}
        loading={searchLoading}
      >
        <>
          <form onSubmit={(e) => onSubmit(e)} id="searchForm">
            <TextField
              autoFocus
              margin="dense"
              id="movie"
              label="Movie Name"
              fullWidth
              onChange={(e) => setMovieName(e.currentTarget.value)}
              required
              disabled={searchLoading}
            />
          </form>
        </>
      </SearchDialog>
      <MovieResults items={foundMovies} open={showResults} onClose={() => setShowResults(false)} />
    </>
  );
};

export default MovieSearch;
