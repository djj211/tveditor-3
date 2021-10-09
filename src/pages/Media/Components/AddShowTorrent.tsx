import React from 'react';
import TextField from '@mui/material/TextField';
import makeStyles from '@mui/styles/makeStyles';

import ActionDialog from '../../../components/ActionDialog';
import { useTorrents } from '../../../hooks/useTorrents';
import { DELUGE_DOWNLOAD_TYPE } from '../../../interfaces';

const useStyles = makeStyles(() => ({
  seasonInput: {
    width: 60,
    marginRight: 10,
  },
}));

interface Props {
  open: boolean;
  handleClose: () => void;
}

const AddShowTorrent = ({ open, handleClose }: Props) => {
  const { loading, addTorrent } = useTorrents();
  const [magnetUrl, setMagnetUrl] = React.useState<string>();
  const [showName, setShowName] = React.useState<string>();
  const [season, setSeason] = React.useState<number>();

  const classes = useStyles();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    if (magnetUrl && showName && season) {
      const appendPath = `${showName}/Season ${season}`;
      await addTorrent(magnetUrl, DELUGE_DOWNLOAD_TYPE.SHOW, appendPath);
      onClose();
    }
  };

  const onClose = () => {
    if (loading) return;
    setMagnetUrl('');
    setShowName('');
    handleClose();
  };

  return (
    <ActionDialog
      formName="showTorrent"
      subTitle="Enter Magnet URL to download show torrent"
      open={open}
      handleClose={onClose}
      loading={loading}
      title="Download Show Torrent"
      submitButtonText="Download"
    >
      <>
        <form onSubmit={(e) => onSubmit(e)} id="showTorrent">
          <TextField
            margin="dense"
            id="movie"
            label="Magnet URL"
            fullWidth
            onChange={(e) => setMagnetUrl(e.currentTarget.value)}
            required
            disabled={loading}
          />
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
        </form>
      </>
    </ActionDialog>
  );
};

export default AddShowTorrent;
