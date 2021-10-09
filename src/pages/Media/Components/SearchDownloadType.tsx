import React from 'react';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import TextField from '@mui/material/TextField';
import makeStyles from '@mui/styles/makeStyles';

import ActionDialog from '../../../components/ActionDialog';
import { DELUGE_DOWNLOAD_TYPE, Torrent } from '../../../interfaces';
import { useTorrents } from '../../../hooks/useTorrents';

const useStyles = makeStyles(() => ({
  seasonInput: {
    width: 60,
    marginRight: 10,
  },
}));

interface Props {
  open: boolean;
  torrent: Torrent;
  handleClose: () => void;
}

const SearchDownloadType = ({ torrent, open, handleClose }: Props) => {
  const [downloadType, setDownloadType] = React.useState<DELUGE_DOWNLOAD_TYPE>();
  const [showName, setShowName] = React.useState<string>();
  const [season, setSeason] = React.useState<number>();
  const { addSearchTorrent, loading } = useTorrents();

  const classes = useStyles();

  const onClose = () => {
    setDownloadType(undefined);
    setShowName(undefined);
    setSeason(undefined);
    handleClose();
  };

  const doSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading || !downloadType || (downloadType === DELUGE_DOWNLOAD_TYPE.SHOW && (!season || !showName))) {
      return;
    }

    const appendPath = downloadType === DELUGE_DOWNLOAD_TYPE.SHOW ? `${showName}/Season ${season}` : undefined;

    await addSearchTorrent(torrent, downloadType, appendPath);
    onClose();
  };

  const stringToTorrentTypeEnum = (type: string) => {
    switch (type) {
      case 'movie':
        return DELUGE_DOWNLOAD_TYPE.MOVIE;
      case 'show':
        return DELUGE_DOWNLOAD_TYPE.SHOW;
      default:
        return;
    }
  };

  const handleTypeChange = (_event: React.ChangeEvent<HTMLInputElement>, value: string) => {
    const type = stringToTorrentTypeEnum(value);
    setDownloadType(type);
    setShowName(undefined);
    setSeason(undefined);
  };

  return (
    <ActionDialog
      open={open}
      formName="torrentDownload"
      loading={loading}
      title="Download Type"
      subTitle="Select Download Type"
      submitButtonText="Download"
      handleClose={onClose}
    >
      <form onSubmit={(e) => doSubmit(e)} id="torrentDownload">
        <FormControl required component="fieldset">
          <FormLabel component="legend">Type</FormLabel>
          <RadioGroup row aria-label="searchType" name="row-radio-buttons-group" onChange={handleTypeChange}>
            <FormControlLabel disabled={loading} value={DELUGE_DOWNLOAD_TYPE.MOVIE} control={<Radio />} label="Movie" />
            <FormControlLabel disabled={loading} value={DELUGE_DOWNLOAD_TYPE.SHOW} control={<Radio />} label="Show" />
          </RadioGroup>
        </FormControl>
        {downloadType === DELUGE_DOWNLOAD_TYPE.SHOW && (
          <>
            <TextField
              margin="dense"
              id="showName"
              label="Show Name"
              fullWidth
              onChange={(e) => setShowName(e.currentTarget.value)}
              required
              disabled={loading}
            />
            <TextField
              id="season"
              label="Season"
              type="number"
              className={classes.seasonInput}
              InputProps={{
                inputProps: {
                  min: 1,
                },
              }}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => setSeason(+e.currentTarget.value)}
              disabled={loading}
              required
            />
          </>
        )}
      </form>
    </ActionDialog>
  );
};

export default SearchDownloadType;
