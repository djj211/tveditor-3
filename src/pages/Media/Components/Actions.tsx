import React from 'react';
import GetAppIcon from '@mui/icons-material/GetApp';
import SearchIcon from '@mui/icons-material/Search';
import TvIcon from '@mui/icons-material/Tv';
import MovieIcon from '@mui/icons-material/Movie';
import makeStyles from '@mui/styles/makeStyles';

import AddButton from '../../../components/FabButton/AddButton';
import SpeedDial from '../../../components/SpeedDial';
import Tooltip from '@mui/material/Tooltip';
import AddMovieTorrent from './AddMovieTorrent';
import AddShowTorrent from './AddShowTorrent';
import TorrentSearch from './TorrentSearch';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    position: 'sticky',
    bottom: 10,
    float: 'right',
    width: 125,
    justifyContent: 'space-evenly',
  },
  addButton: {
    alignSelf: 'end',
  },
}));

interface Props {
  onAddClick: () => void;
}

const Actions = ({ onAddClick }: Props) => {
  const [movieTorrentOpen, setMovieTorrentOpen] = React.useState(false);
  const [showTorrentOpen, setShowTorrentOpen] = React.useState(false);
  const [torrentSearchOpen, setTorrentSearchOpen] = React.useState(false);

  const enableDeluge =
    process.env.REACT_APP_ENABLE_DELUGE_CONTROLS &&
    process.env.REACT_APP_ENABLE_DELUGE_CONTROLS.toLowerCase() === 'true';

  const classes = useStyles();

  const delugeSpeedDial = [
    {
      icon: <SearchIcon />,
      name: 'Torrent Search',
      onClick: () => {
        setTorrentSearchOpen(true);
      },
    },
    {
      icon: <TvIcon />,
      name: 'Add TV Show Torrent',
      onClick: () => {
        setShowTorrentOpen(true);
      },
    },
    {
      icon: <MovieIcon />,
      name: 'Add Movie Torrent',
      onClick: () => {
        setMovieTorrentOpen(true);
      },
    },
  ];

  return (
    <>
      <div className={classes.root}>
        <Tooltip title="Add Show">
          <AddButton onClick={onAddClick} className={classes.addButton} />
        </Tooltip>
        {enableDeluge && <SpeedDial actions={delugeSpeedDial} icon={<GetAppIcon />} />}
      </div>
      <AddMovieTorrent open={movieTorrentOpen} handleClose={() => setMovieTorrentOpen(false)} />
      <AddShowTorrent open={showTorrentOpen} handleClose={() => setShowTorrentOpen(false)} />
      {torrentSearchOpen && <TorrentSearch open={torrentSearchOpen} onClose={() => setTorrentSearchOpen(false)} />}
    </>
  );
};

export default Actions;
