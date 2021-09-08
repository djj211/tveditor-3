import React from "react";
import { makeStyles } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(() => ({
    showInput: {
        width: 60,
        marginRight: 10
    },
}));

interface Props {
    enabled?: boolean;
    loading?: boolean;
    defaultSeasonVal?: number | string;
    defaultEpisodeVal?: number | string;
    onSeasonChange?: (season: number) => void;
    onEpisodeChange?: (episode: number) => void;
}

const EpisodeSetter = ({ enabled = true, loading, defaultSeasonVal, defaultEpisodeVal, onSeasonChange, onEpisodeChange}: Props) => {
    const classes = useStyles();

    const seasonChange = (season: string) => {
        if (onSeasonChange) {
            onSeasonChange(+season);
        }
    }

    const episodeChange = (episode: string) => {
        if (onEpisodeChange) {
            onEpisodeChange(+episode);
        }
    }

    return (
     <>
        <TextField
            id="season"
            label="Season"
            type="number"
            className={classes.showInput}
            defaultValue={defaultSeasonVal}
            InputProps={{
                inputProps: { 
                    min: 1 
                }
            }}
            InputLabelProps={{
                shrink: true,
            }}
            onChange={(e) => seasonChange(e.currentTarget.value)}
            disabled={!enabled || loading}
            required={enabled}
        />
        <TextField
            id="episode"
            label="Episode"
            type="number"
            className={classes.showInput}
            defaultValue={defaultEpisodeVal}
            InputProps={{
                inputProps: { 
                    min: 1 
                }
            }}
            InputLabelProps={{
                shrink: true,
            }}
            onChange={(e) => episodeChange(e.currentTarget.value)}
            disabled={!enabled || loading}
            required={enabled}
        />
      </>
    )
}

export default EpisodeSetter;