import React from 'react';
import TextField from '@mui/material/TextField';

import ActionDialog from '../../../components/ActionDialog';
import { useTorrents } from '../../../hooks/useTorrents';
import { DELUGE_DOWNLOAD_TYPE } from '../../../interfaces';

interface Props {
  open: boolean;
  handleClose: () => void;
}

const AddMovieTorrent = ({ open, handleClose }: Props) => {
  const { loading, addTorrent } = useTorrents();
  const [magnetUrl, setMagnetUrl] = React.useState<string>();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    if (magnetUrl) {
      const resp = await addTorrent(magnetUrl, DELUGE_DOWNLOAD_TYPE.MOVIE);
      console.log(resp);
      onClose();
    }
  };

  const onClose = () => {
    if (loading) return;
    setMagnetUrl('');
    handleClose();
  };

  return (
    <ActionDialog
      formName="movieTorrent"
      subTitle="Enter Magnet URL to download movie torrent"
      open={open}
      handleClose={onClose}
      loading={loading}
      title="Download Movie Torrent"
      submitButtonText="Download"
    >
      <>
        <form onSubmit={(e) => onSubmit(e)} id="movieTorrent">
          <TextField
            autoFocus
            margin="dense"
            id="movie"
            label="Magnet URL"
            fullWidth
            onChange={(e) => setMagnetUrl(e.currentTarget.value)}
            required
            disabled={loading}
          />
        </form>
      </>
    </ActionDialog>
  );
};

export default AddMovieTorrent;
