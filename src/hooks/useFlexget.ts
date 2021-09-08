import { AxiosRequestConfig } from "axios";

import { useApi } from "./useApi";
import { FlexgetShow, FlexgetTask, CreateFlexget } from "../interfaces";

const AXIOS_CONFIG: AxiosRequestConfig = {
    auth: {
        username: process.env.REACT_APP_FLEXGET_API_USER!,
        password: process.env.REACT_APP_FLEXGET_API_PASSWORD!   
    }
}

const BASE_URL = process.env.REACT_APP_FLEXGET_API_URL!;
const TASK_NAME = process.env.REACT_APP_TASK_NAME!

export const useFlexget = () => {
    const { get, post, put, del } = useApi(BASE_URL);

    const getCreateFlexgetShow = (name: string, season: number, episode: number): CreateFlexget => {
        const formattedSeason = season < 10 ? `0${season}` : `${season}`;
        const formattedEpisode = episode < 10 ? `0${episode}` : `${episode}`;

        return {
            name,
            begin_episode: `S${formattedSeason}E${formattedEpisode}`,
            alternate_names: []
        };

    }

    const getSeries = () => {
        return get<FlexgetShow[]>("series?in_config=all&order=asc&sort_by=show_name", AXIOS_CONFIG);
    }

    const getTask = () => {
        return get<FlexgetTask>(`/tasks/${TASK_NAME}`, AXIOS_CONFIG);
    }

    const addSeries = async(name: string, season: number, episode: number) => {
        const task = await getTask();

        const existing = task.config.series.default.find((s) => s === name);

        if (existing) {
            throw new Error("Show already exists");
        }

        task.config.series.default = [
            ...task.config.series.default,
            name
        ]

        await put<FlexgetTask, FlexgetTask>(`/tasks/${TASK_NAME}`, task, AXIOS_CONFIG);

        const createShow = getCreateFlexgetShow(name, season, episode);

        return post<FlexgetShow, CreateFlexget>("series", createShow, AXIOS_CONFIG)

    }

    const editSeries = async(showId: number, name: string, season: number, episode: number) => {
        const createShow = getCreateFlexgetShow(name, season, episode);

        return put<FlexgetShow, CreateFlexget>(`/series/${showId}`, createShow, AXIOS_CONFIG);

    }

    const deleteSeries = async(showId: number, name: string) => {
        const task = await getTask();
        task.config.series.default = task.config.series.default.filter(s => s !== name);

        await put<FlexgetTask, FlexgetTask>(`/tasks/${TASK_NAME}`, task, AXIOS_CONFIG);

        return del<FlexgetShow>(`/series/${showId}`, AXIOS_CONFIG);
    }

    return {
        getSeries,
        addSeries,
        editSeries,
        deleteSeries
    }
} 