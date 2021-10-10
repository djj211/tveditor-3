import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import { useToasts } from 'react-toast-notifications';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Input from '@mui/material/Input';

import SearchResults from '../../../components/SearchResults';
import SearchDownloadType from './SearchDownloadType';
import { Torrent, TORRENT_SEARCH_TYPE } from '../../../interfaces';
import { useTorrents } from '../../../hooks/useTorrents';

const useStyles = makeStyles((theme) => ({
  typeContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  selected: {
    cursor: 'pointer',
    backgroundColor: '#8bd5db',
  },
  result: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#8bd5db',
    },
  },
  loading: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: 20,
  },
}));

interface Props {
  open: boolean;
  onClose: () => void;
}

const TorrentSearch = ({ onClose, open }: Props) => {
  const classes = useStyles();
  const [selected, setSelected] = React.useState<Torrent>();
  const [torrentType, setTorrentType] = React.useState(TORRENT_SEARCH_TYPE.SHOWS);
  const [showTypeSelect, setShowTypeSelect] = React.useState(false);
  const searchInputRef = React.useRef<HTMLInputElement | null>(null);

  const { searchTorrent, searchLoading, searchedTorrents } = useTorrents();
  const { addToast } = useToasts();

  const handleOnClose = () => {
    onClose();
    setSelected(undefined);
    setShowTypeSelect(false);
  };

  const onTorrentClick = (torrent: Torrent) => {
    if (torrent.title === selected?.title && torrent.seeds === selected.seeds) {
      setSelected(undefined);
      return;
    }

    setSelected(torrent);
  };

  const stringToTorrentTypeEnum = (type: string) => {
    switch (type) {
      case 'Movies':
        return TORRENT_SEARCH_TYPE.MOVIES;
      case 'ALL':
        return TORRENT_SEARCH_TYPE.ALL;
      case 'TV':
      default:
        return TORRENT_SEARCH_TYPE.SHOWS;
    }
  };

  const handleTypeChange = (_event: React.ChangeEvent<HTMLInputElement>, value: string) => {
    const type = stringToTorrentTypeEnum(value);
    setTorrentType(type);
  };

  const doSearch = React.useCallback(() => {
    if (searchLoading || !searchInputRef?.current?.value || !torrentType) return;
    searchTorrent(searchInputRef.current.value, 100, torrentType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTorrent]);

  const handleSave = async () => {
    if (selected?.title) {
      setShowTypeSelect(true);
    } else {
      addToast(`You must select a torrent!`, { appearance: 'error' });
    }
  };

  React.useEffect(() => {
    doSearch();
  }, [torrentType, doSearch]);

  return (
    <>
      <SearchResults
        open={open}
        handleOnClose={handleOnClose}
        handleSave={handleSave}
        disabled={searchLoading}
        loading={false}
        title="Torrent Search"
        saveText="Download"
      >
        <>
          <div className={classes.typeContainer}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Type</FormLabel>
              <RadioGroup
                row
                aria-label="searchType"
                name="row-radio-buttons-group"
                defaultValue={TORRENT_SEARCH_TYPE.SHOWS}
                onChange={handleTypeChange}
              >
                <FormControlLabel
                  disabled={searchLoading}
                  value={TORRENT_SEARCH_TYPE.ALL}
                  control={<Radio />}
                  label="All"
                />
                <FormControlLabel
                  disabled={searchLoading}
                  value={TORRENT_SEARCH_TYPE.MOVIES}
                  control={<Radio />}
                  label="Movies"
                />
                <FormControlLabel
                  disabled={searchLoading}
                  value={TORRENT_SEARCH_TYPE.SHOWS}
                  control={<Radio />}
                  label="Shows"
                />
              </RadioGroup>
            </FormControl>
          </div>
          <FormControl fullWidth>
            <InputLabel htmlFor="search-torrent">Search</InputLabel>
            <Input
              id="search-torrent"
              inputRef={searchInputRef}
              disabled={searchLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  doSearch();
                }
              }}
              fullWidth
              endAdornment={
                <InputAdornment position="end">
                  <IconButton aria-label="search torrent" onClick={doSearch}>
                    {searchLoading ? <CircularProgress size={20} /> : <SearchIcon />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          {searchLoading ? (
            <div className={classes.loading}>
              <CircularProgress />
            </div>
          ) : (
            <TableContainer style={{ marginTop: 20 }} component={Paper}>
              <Table sx={{ minWidth: 650 }} size="small" aria-label="Torrents Table">
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell align="right">Size</TableCell>
                    <TableCell align="right">Provider</TableCell>
                    <TableCell align="right">Seeds</TableCell>
                    <TableCell align="right">Peers</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {searchedTorrents.map((torrent, index) => (
                    <TableRow
                      key={`${torrent.title}-${index}`}
                      className={
                        torrent.title === selected?.title && torrent.seeds === selected?.seeds
                          ? classes.selected
                          : classes.result
                      }
                      onClick={() => onTorrentClick(torrent)}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {torrent.title}
                      </TableCell>
                      <TableCell align="right">{torrent.size}</TableCell>
                      <TableCell align="right">{torrent.provider}</TableCell>
                      <TableCell align="right">{torrent.seeds ? torrent.seeds : '0'}</TableCell>
                      <TableCell align="right">{torrent.peers ? torrent.peers : '0'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      </SearchResults>
      <SearchDownloadType torrent={selected!} open={showTypeSelect} handleClose={handleOnClose} />
    </>
  );
};

export default TorrentSearch;
