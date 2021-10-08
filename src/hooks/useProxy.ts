import { Show, FlexgetShow, TVDBShowItem, Movie, TVDBMovieItem } from '../interfaces';
import { useProxyBase } from './useProxyBase';

interface CreateShow {
  name: string;
  season: number;
  episode: number;
  tvdbId: string;
}

interface CreateMovie {
  name: string;
  year: number;
  tvdbId: string;
}

export const useProxy = () => {
  const { get, post, put, del } = useProxyBase();

  const getShows = async () => {
    return get<Show[]>('shows');
  };

  const addShow = async (name: string, season: number, episode: number, tvdbId: string) => {
    const show: CreateShow = {
      name,
      season,
      episode,
      tvdbId,
    };
    return post<FlexgetShow, CreateShow>('shows', show);
  };

  const editShow = async (showId: number, name: string, season: number, episode: number, tvdbId: string) => {
    const show: CreateShow = {
      name,
      season,
      episode,
      tvdbId,
    };
    return put<FlexgetShow, CreateShow>(`/shows/${showId}`, show);
  };

  const deleteShow = async (showId: number) => {
    return del<FlexgetShow>(`/shows/${showId}`);
  };

  const searchShows = async (show: string): Promise<TVDBShowItem[]> => {
    return get<TVDBShowItem[]>(`search/shows?queryStr=${show}`);
  };

  const addMovie = async (name: string, year: number, tvdbId: string) => {
    const movie: CreateMovie = {
      name,
      year,
      tvdbId,
    };
    return post<FlexgetShow, CreateMovie>('movies', movie);
  };

  const searchMovies = async (movie: string): Promise<TVDBMovieItem[]> => {
    return get<TVDBMovieItem[]>(`search/movies?queryStr=${movie}`);
  };

  const getMovies = async () => {
    return get<Movie[]>('movies');
  };

  const deleteMovie = async (movieId: number) => {
    return del<FlexgetShow>(`/movies/${movieId}`);
  };

  const editMovie = async (movieId: number, name: string, year: number, tvdbId: string) => {
    const movie: CreateMovie = {
      name,
      year,
      tvdbId,
    };
    return put<FlexgetShow, CreateMovie>(`/movies/${movieId}`, movie);
  };

  return {
    getShows,
    getMovies,
    addShow,
    editShow,
    deleteShow,
    searchShows,
    searchMovies,
    deleteMovie,
    editMovie,
    addMovie,
  };
};
