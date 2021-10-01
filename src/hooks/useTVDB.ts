import { AxiosRequestConfig } from 'axios';
import jwt_decode from 'jwt-decode';

import { useApi } from './useApi';
import { TVDBShowItem, DecodedToken } from '../interfaces';

const TVDB_PIN = process.env.REACT_APP_TVDB_PIN!;
const TVDB_API_KEY = process.env.REACT_APP_TVDB_API_KEY!;
const BASE_URL = process.env.REACT_APP_TVDB_API_URL!;

interface TVDBResp {
  data: [
    {
      aliases: string[];
      id: string;
      objectID: string;
      name: string;
      network: string;
      image_url: string;
      status: string;
      primary_language: string;
      overview: string;
      name_translated?: {
        eng?: string;
      };
      overview_translated?: {
        eng?: string;
      };
    },
  ];
}

interface TVDBEpisode {
  aired: string;
  number: number;
  seasonNumber: number;
}

interface EpisodeResp {
  data: {
    episodes: TVDBEpisode[];
  };
}

export const useTVDB = () => {
  const { get, post } = useApi(BASE_URL);

  const login = async () => {
    const token = localStorage.getItem('tvdbToken');

    // Is there a token in storage and has it expired.
    // If not return the token
    if (token) {
      const decoded: DecodedToken = jwt_decode(token);
      const currTime = new Date().getTime();

      if (decoded.exp * 1000 > currTime) {
        return token;
      }
    }

    // Token has expired get new token and update local storage.
    const { data } = await post<{ data: { token: string } }, { apikey: string; pin: string }>('login', {
      apikey: TVDB_API_KEY,
      pin: TVDB_PIN,
    });

    localStorage.setItem('tvdbToken', data.token);

    return data.token;
  };

  const getConfig = async (): Promise<AxiosRequestConfig> => {
    const token = await login();
    return {
      headers: { Authorization: `Bearer ${token}` },
    };
  };

  const searchOne = async (show: string): Promise<TVDBShowItem> => {
    const resp = await search(show, 5);
    const foundShow = resp.find((t) => t.name === show);
    if (foundShow) {
      return foundShow;
    }

    return resp[0];
  };

  const search = async (show: string, limit?: number): Promise<TVDBShowItem[]> => {
    const config = await getConfig();
    const sanitizedLimit = limit ? limit : 10;
    const resp = await get<TVDBResp>(`search?q=${show}&limit=${sanitizedLimit}&type=series`, config);
    const today = new Date();
    const allDataPromises = resp.data.map(async (t) => {
      const plainId = t.objectID.split('-')[1];

      const seriesEps = await episodes(plainId);

      const latest = seriesEps.data.episodes.reduce(
        (acc, curr) => {
          if (!acc.aired) return curr;
          const cDate = new Date(curr.aired);
          const aDate = new Date(acc.aired);
          // Handle 2 eps on same day
          if (cDate.getTime() === aDate.getTime() && cDate <= today) {
            return curr.number >= acc.number ? curr : acc;
          }
          return cDate > aDate && cDate <= today ? curr : acc;
        },
        { aired: '', number: 0, seasonNumber: 0 },
      );

      const nextUp = seriesEps.data.episodes.reduce((acc, curr) => {
        const cDate = new Date(curr.aired);

        if (cDate > today) {
          const aDate = new Date(acc.aired);

          if (aDate <= today) {
            return curr;
          }

          if (cDate <= aDate) {
            return curr;
          }
        }

        return acc;
      }, latest);

      const nextUpIsLatest = nextUp.seasonNumber === latest.seasonNumber && nextUp.number === latest.number;

      return {
        ...t,
        name: t.primary_language !== 'eng' && t.name_translated?.eng ? t.name_translated?.eng : t.name,
        overview: t.primary_language !== 'eng' && t.overview_translated?.eng ? t.overview_translated?.eng : t.overview,
        id: t.objectID,
        latestEpisode: {
          season: latest.seasonNumber,
          number: latest.number,
          airDate: latest.aired,
        },
        nextEpisode: {
          season: nextUpIsLatest ? latest.seasonNumber + 1 : nextUp.seasonNumber,
          number: nextUpIsLatest ? 1 : nextUp.number,
          airDate: nextUpIsLatest ? undefined : nextUp.aired,
        },
      };
    });

    return await Promise.all(allDataPromises);
  };

  const episodes = async (id: string): Promise<EpisodeResp> => {
    const config = await getConfig();
    return get<EpisodeResp>(`series/${id}/episodes/default?page=0&season=0`, config);
  };

  return { search, searchOne };
};
