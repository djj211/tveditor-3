import React from 'react';

import { Show, TVDBShowItem, Movie, TVDBMovieItem } from '../interfaces';
import { useProxy } from '../hooks/useProxy';

export enum SELECTED_MEDIA {
  MOVIE = 'movie',
  SHOWS = 'shows',
}

interface MediaContextType {
  shows?: Show[];
  movies?: Movie[];
  selectedMedia: SELECTED_MEDIA;
  refreshLoading: boolean;
  searchLoading: boolean;
  editLoading: boolean;
  deleteLoading: boolean;
  refreshShows: () => Promise<void>;
  addShow: (name: string, season: number, episode: number, tvdbId: string) => Promise<void>;
  editShow: (showId: number, name: string, season: number, episode: number, tvdbId: string) => Promise<void>;
  deleteShow: (showId: number, name: string) => Promise<void>;
  searchShows: (queryStr: string) => Promise<TVDBShowItem[] | undefined>;
  refreshMovies: () => Promise<void>;
  addMovie: (name: string, year: number, tvdbId: string) => Promise<void>;
  editMovie: (movieId: number, name: string, year: number, tvdbId: string) => Promise<void>;
  deleteMovie: (showId: number, name: string) => Promise<void>;
  searchMovies: (queryStr: string) => Promise<TVDBMovieItem[] | undefined>;
  setSelectedMediaType: (type: SELECTED_MEDIA) => void;
}

const initialState: MediaContextType = {
  shows: [],
  movies: [],
  selectedMedia: SELECTED_MEDIA.SHOWS,
  refreshLoading: false,
  searchLoading: false,
  editLoading: false,
  deleteLoading: false,
  refreshShows: async () => {},
  addShow: async () => {},
  editShow: async () => {},
  deleteShow: async () => {},
  searchShows: async (_queryStr: string) => {
    return undefined;
  },
  refreshMovies: async () => {},
  addMovie: async () => {},
  editMovie: async () => {},
  deleteMovie: async () => {},
  searchMovies: async (_queryStr: string) => {
    return undefined;
  },
  setSelectedMediaType: () => {},
};

const MediaContext = React.createContext<MediaContextType>(initialState);

const MediaContextProvider = ({ children }: { children?: React.ReactNode }) => {
  const [refreshLoading, setRefreshLoading] = React.useState(false);
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [editLoading, setEditLoading] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [shows, setShows] = React.useState<Show[]>();
  const [movies, setMovies] = React.useState<Movie[]>();
  const [selectedMedia, setSelectedMedia] = React.useState(SELECTED_MEDIA.SHOWS);

  const {
    getShows,
    addShow: addShowProxy,
    editShow: editShowProxy,
    deleteShow: deleteShowProxyProxy,
    searchShows: searchShowProxy,
    getMovies,
    addMovie: addMovieProxy,
    editMovie: editMovieProxy,
    deleteMovie: deleteMovieProxy,
    searchMovies: searchMoviesProxy,
  } = useProxy();

  const setSelectedMediaType = React.useCallback((type: SELECTED_MEDIA) => {
    setSelectedMedia(type);
  }, []);

  const doShowRefresh = React.useCallback(async () => {
    const showData = await getShows();
    setShows(showData);
  }, [getShows, setShows]);

  const doMoviesRefresh = React.useCallback(async () => {
    const movieData = await getMovies();
    setMovies(movieData);
  }, [getMovies]);

  const refreshShows = React.useCallback(async () => {
    setRefreshLoading(true);
    await doShowRefresh();
    setRefreshLoading(false);
  }, [setRefreshLoading, doShowRefresh]);

  const refreshMovies = React.useCallback(async () => {
    setRefreshLoading(true);
    await doMoviesRefresh();
    setRefreshLoading(false);
  }, [setRefreshLoading, doMoviesRefresh]);

  const addShow = async (name: string, season: number, episode: number, tvdbId: string) => {
    setEditLoading(true);
    try {
      await addShowProxy(name, season, episode, tvdbId);
      await doShowRefresh();
    } catch (ex) {
      throw ex;
    } finally {
      setEditLoading(false);
    }
  };

  const addMovie = async (name: string, year: number, tvdbId: string) => {
    setEditLoading(true);
    try {
      await addMovieProxy(name, year, tvdbId);
      await doMoviesRefresh();
    } catch (ex) {
      throw ex;
    } finally {
      setEditLoading(false);
    }
  };

  const editShow = async (showId: number, name: string, season: number, episode: number, tvdbId: string) => {
    setEditLoading(true);
    await editShowProxy(showId, name, season, episode, tvdbId);
    await doShowRefresh();
    setEditLoading(false);
  };

  const editMovie = async (movieId: number, name: string, year: number, tvdbId: string) => {
    setEditLoading(true);
    await editMovieProxy(movieId, name, year, tvdbId);
    await doMoviesRefresh();
    setEditLoading(false);
  };

  const deleteShow = async (showId: number, name: string) => {
    setDeleteLoading(true);
    await deleteShowProxyProxy(showId);
    await doShowRefresh();
    setDeleteLoading(false);
  };

  const deleteMovie = async (showId: number, name: string) => {
    setDeleteLoading(true);
    await deleteMovieProxy(showId);
    await doMoviesRefresh();
    setDeleteLoading(false);
  };

  const searchShows = async (queryStr: string) => {
    setSearchLoading(true);
    const shows = await searchShowProxy(queryStr);
    setSearchLoading(false);
    return shows;
  };

  const searchMovies = async (queryStr: string) => {
    setSearchLoading(true);
    const shows = await searchMoviesProxy(queryStr);
    setSearchLoading(false);
    return shows;
  };

  const value: MediaContextType = {
    shows,
    movies,
    selectedMedia,
    refreshLoading,
    searchLoading,
    editLoading,
    deleteLoading,
    refreshShows,
    addShow,
    editShow,
    deleteShow,
    searchShows,
    refreshMovies,
    addMovie,
    editMovie,
    deleteMovie,
    searchMovies,
    setSelectedMediaType,
  };

  return <MediaContext.Provider value={value}>{children}</MediaContext.Provider>;
};

export const useMedia = () => React.useContext(MediaContext);

export default MediaContextProvider;
