import React from 'react';

import { useProxyBase } from './useProxyBase';
import {
  DELUGE_DOWNLOAD_TYPE,
  DelugeDownload,
  TORRENT_SEARCH_TYPE,
  Torrent,
  TorrentSearchDownload,
} from '../interfaces';

export const useTorrents = () => {
  const [loading, setLoading] = React.useState(false);
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [searchedTorrents, setSearchedTorrents] = React.useState<Torrent[]>([]);
  const { get, post } = useProxyBase();

  const addTorrent = async (magnetUrl: string, type: DELUGE_DOWNLOAD_TYPE, appendPath?: string) => {
    setLoading(true);
    const resp = await post<{ torrentId: string }, DelugeDownload>('torrents/add', {
      magnetUrl,
      downloadType: type,
      options: {
        appendPath,
      },
    });
    setLoading(false);
    return resp;
  };

  const addSearchTorrent = React.useCallback(
    async (torrent: Torrent, type: DELUGE_DOWNLOAD_TYPE, appendPath?: string) => {
      setLoading(true);
      const resp = await post<{ torrent: string }, TorrentSearchDownload>('torrents/search/add', {
        torrent,
        downloadType: type,
        options: {
          appendPath,
        },
      });
      setLoading(false);
      return resp;
    },
    [setLoading, post],
  );

  const searchTorrent = async (query: string, limit: number, type: TORRENT_SEARCH_TYPE) => {
    setSearchLoading(true);
    const resp = await get<Torrent[]>(`torrents/search?query=${query}&limit=${limit}&type=${type}`);
    setSearchedTorrents(resp);
    setSearchLoading(false);
  };

  return {
    addTorrent,
    addSearchTorrent,
    searchTorrent,
    searchedTorrents,
    loading,
    searchLoading,
  };
};
