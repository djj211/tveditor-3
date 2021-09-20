import React from 'react';

import { Show, TVDBItem } from '../interfaces';
import { useFlexget } from "../hooks/useFlexget";
import { useTVDB } from "../hooks/useTVDB";
import { useProxy } from "../hooks/useProxy";
import { useAuth } from "../Context/auth.context";

interface ShowsContextType {
    shows?: Show[];
    refreshLoading: boolean,
    searchLoading: boolean,
    editLoading: boolean,
    deleteLoading: boolean;
    refreshShows: () => Promise<void>
    addShow: (name: string, season: number, episode: number) => Promise<void>;
    editShow: (showId: number, name: string, season: number, episode: number) => Promise<void>;
    deleteShow: (showId: number, name: string) => Promise<void>;
    searchShows: (queryStr: string) => Promise<TVDBItem[] | undefined>;
}

const initialState: ShowsContextType = {
    shows: [],
    refreshLoading: false,
    searchLoading: false,
    editLoading: false,
    deleteLoading: false,
    refreshShows: async() => {return},
    addShow: async(_name: string, _season: number, _episode: number) => {return},
    editShow: async(_showId: number, _name: string, _season: number, _episode: number) => {return},
    deleteShow: async(_showId: number, _name: string) => {return},
    searchShows: async(_queryStr: string) => {return undefined}
}

const ShowsContext = React.createContext<ShowsContextType>(initialState);

const ShowsContextProvider = ({
    children
}: { children?: React.ReactNode}) => {
    const [ refreshLoading, setRefreshLoading ] = React.useState(false);
    const [ searchLoading, setSearchLoading ] = React.useState(false);
    const [ editLoading, setEditLoading ] = React.useState(false);
    const [ deleteLoading, setDeleteLoading ] = React.useState(false);
    const [ shows, setShows ] = React.useState<Show[]>();

    const { usingProxy } = useAuth();
    const { getSeries, addSeries, editSeries, deleteSeries } = useFlexget();
    const { search, searchOne } = useTVDB();
    const { getShows: getProxy, addShow: addProxy, editShow: editProxy, deleteShow: deleteProxy, search: searchProxy } = useProxy();

    const doRefresh = async() => {
        const foundShows = await getSeries();
        const showData = await Promise.all(foundShows.map(async (f) => {
            return {
                flexget: f,
                tvdb: await searchOne(f.name)
            }
        }));
        setShows(showData);
    }

    const proxyRefresh = async () => {
        const showData = await getProxy();
        setShows(showData);
    }

    const theRefresh = usingProxy ? proxyRefresh : doRefresh;
    const theAdd = usingProxy ? addProxy : addSeries;
    const theEdit = usingProxy ? editProxy : editSeries;
    const theSearch = usingProxy ? searchProxy : search;

    const refreshShows = async() => {
        setRefreshLoading(true);
        await theRefresh();
        setRefreshLoading(false);
    }

    const addShow = async(name: string, season: number, episode: number) => {
        setEditLoading(true);
        try {
            await theAdd(name, season, episode);
            await theRefresh();
        }
        catch(ex) {
            throw ex;
        }
        finally {
            setEditLoading(false);
        }
    }

    const editShow = async(showId: number, name: string, season: number, episode: number) => {
        setEditLoading(true);
        await theEdit(showId, name, season, episode);
        await theRefresh();
        setEditLoading(false);
    }

    const deleteShow = async(showId: number, name: string) => {
        setDeleteLoading(true);
        if (usingProxy) {
            await deleteProxy(showId);
        }
        else {
            await deleteSeries(showId, name);
        }
        await theRefresh();
        setDeleteLoading(false);
    }

    const searchShows = async(queryStr: string) => {
        setSearchLoading(true);
        const shows = await theSearch(queryStr);
        setSearchLoading(false);
        return shows;
    }

    const value: ShowsContextType = {
        shows,
        refreshLoading,
        searchLoading,
        editLoading,
        deleteLoading,
        refreshShows,
        addShow,
        editShow,
        deleteShow,
        searchShows
    }

    return (<ShowsContext.Provider value={value}>{children}</ShowsContext.Provider>)
    
}

export const useShows = () => React.useContext(ShowsContext);

export default ShowsContextProvider;