import { AxiosRequestConfig } from "axios";

import { useApi } from "./useApi";
import { useAuth } from "../Context/auth.context";
import { Show, FlexgetShow, TVDBItem } from '../interfaces';

const BASE_URL = `${process.env.REACT_APP_PROXY_API_URL!}/api`;

interface CreateShow {
    name: string; 
    season: number;
    episode: number;
}

interface EditShow extends CreateShow {
    showId: number;
}

export const useProxy = () => {
    const { get, post, put, del } = useApi(BASE_URL);
    const { getToken } = useAuth();
    
    const getConfig = async(): Promise<AxiosRequestConfig> => {
        const token = await getToken();
        return {
            headers: { Authorization: `Bearer ${token}` }
        }
    }

    const getShows = async () => {
        const config = await getConfig();
        return get<Show[]>("shows", config);
    }

    const addShow = async(name: string, season: number, episode: number) => {
        const show: CreateShow = {
            name,
            season,
            episode
        }
        const config = await getConfig();
        return post<FlexgetShow, CreateShow>("shows", show, config)
    }

    const editShow = async(showId: number, name: string, season: number, episode: number) => {
        const show: EditShow = {
            showId,
            name,
            season,
            episode
        }
        const config = await getConfig();
        return put<FlexgetShow, EditShow>("shows", show, config)
    }

    const deleteShow = async(showId: number) => {
        const config = await getConfig();
        return del<FlexgetShow>(`/shows/${showId}`, config);
    }

    const search = async (show: string): Promise<TVDBItem[]> => {
        const config = await getConfig();
        return get<TVDBItem[]>(`search?queryStr=${show}`, config);
    }

    return {
        getShows,
        addShow,
        editShow,
        deleteShow,
        search
    }
}