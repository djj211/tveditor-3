import { AxiosRequestConfig } from 'axios';

import { useApi } from './useApi';
import { useAuth } from '../Context/auth.context';
import { Show, FlexgetShow, TVDBShowItem, Movie, TVDBMovieItem } from '../interfaces';

const BASE_URL = `${process.env.REACT_APP_PROXY_API_URL!}/api`;

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
  const { get, post, put, del } = useApi(BASE_URL);
  const { getToken } = useAuth();

  const getConfig = async (): Promise<AxiosRequestConfig> => {
    const token = await getToken();
    return {
      headers: { Authorization: `Bearer ${token}` },
    };
  };

  const getShows = async () => {
    const config = await getConfig();
    return get<Show[]>('shows', config);
  };

  const addShow = async (name: string, season: number, episode: number, tvdbId: string) => {
    const show: CreateShow = {
      name,
      season,
      episode,
      tvdbId,
    };
    const config = await getConfig();
    return post<FlexgetShow, CreateShow>('shows', show, config);
  };

  const editShow = async (showId: number, name: string, season: number, episode: number, tvdbId: string) => {
    const show: CreateShow = {
      name,
      season,
      episode,
      tvdbId,
    };
    const config = await getConfig();
    return put<FlexgetShow, CreateShow>(`/shows/${showId}`, show, config);
  };

  const deleteShow = async (showId: number) => {
    const config = await getConfig();
    return del<FlexgetShow>(`/shows/${showId}`, config);
  };

  const searchShows = async (show: string): Promise<TVDBShowItem[]> => {
    const config = await getConfig();
    return get<TVDBShowItem[]>(`search/shows?queryStr=${show}`, config);
  };

  const addMovie = async (name: string, year: number, tvdbId: string) => {
    const movie: CreateMovie = {
      name,
      year,
      tvdbId,
    };
    const config = await getConfig();
    return post<FlexgetShow, CreateMovie>('movies', movie, config);
  };

  const searchMovies = async (movie: string): Promise<TVDBMovieItem[]> => {
    const config = await getConfig();
    return get<TVDBMovieItem[]>(`search/movies?queryStr=${movie}`, config);
  };

  const getMovies = async () => {
    const config = await getConfig();
    return get<Movie[]>('movies', config);
  };

  const deleteMovie = async (movieId: number) => {
    const config = await getConfig();
    return del<FlexgetShow>(`/movies/${movieId}`, config);
  };

  const editMovie = async (movieId: number, name: string, year: number, tvdbId: string) => {
    const movie: CreateMovie = {
      name,
      year,
      tvdbId,
    };
    const config = await getConfig();
    return put<FlexgetShow, CreateMovie>(`/movies/${movieId}`, movie, config);
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
