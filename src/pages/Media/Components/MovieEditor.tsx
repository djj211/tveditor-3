import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import TextField from '@mui/material/TextField';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { format } from 'date-fns';
import Typography from '@mui/material/Typography';
import { useToasts } from 'react-toast-notifications';

import { Movie } from '../../../interfaces';
import Poster from '../../../components/Poster';
import ItemEditor from '../../../components/ItemEditor';
import InfoItem from '../../../components/InfoItem';

import { useMedia } from '../../../Context/media.context';

const useStyles = makeStyles((theme) => ({
  overviewContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  overviewText: {
    margin: '0, 20px',
  },
  yearInput: {
    width: 300,
    marginRight: 10,
  },
}));

interface Props {
  item: Movie;
  open: boolean;
  handleClose: () => void;
}

const MovieEditor = ({ item, open, handleClose }: Props) => {
  const classes = useStyles();
  const [year, setYear] = React.useState<Date | null>();
  const nameRef = React.useRef<HTMLInputElement | null>(null);

  const { deleteMovie, editMovie, editLoading, deleteLoading } = useMedia();
  const { addToast } = useToasts();

  React.useEffect(() => {
    if (item.flexget.year) {
      const date = new Date(`01/02/${item.flexget.year}`);
      setYear(date);
    }
  }, [item]);

  const onClose = () => {
    if (editLoading) return;
    handleClose();
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!year || !nameRef?.current?.value || editLoading || deleteLoading) return;

    await editMovie(item.flexget.id, nameRef.current.value, year.getFullYear(), item.tvdb.id);
    addToast(`Movie ${item.flexget.name} Saved Successfully`, { appearance: 'success' });
    handleClose();
  };

  const doDelete = async () => {
    const name = item.flexget.name;
    await deleteMovie(item.flexget.id, item.flexget.name);
    addToast(`Movie ${name} Deleted Successfully`, { appearance: 'success' });
    handleClose();
  };

  const tryFormatDate = (dateStr?: string) => {
    if (dateStr) {
      try {
        return format(new Date(dateStr), 'MM/dd/yyyy');
      } catch (_ex) {
        return dateStr;
      }
    }
    return '';
  };

  return (
    <ItemEditor
      formName="movieForm"
      title={item.flexget.name}
      open={open}
      handleClose={onClose}
      onDelete={doDelete}
      editLoading={editLoading}
      deleteLoading={deleteLoading}
      deleteTitle={`Delete ${item.flexget.name}?`}
      deleteMsg={`Are you sure you want to delete ${item.flexget.name}?`}
    >
      <>
        <div className={classes.overviewContainer}>
          <Poster image={item.tvdb.image_url} width={100} imgAlt={item.flexget.name} />
          <div className={classes.overviewText}>{item.tvdb.overview}</div>
        </div>
        <InfoItem label="Added On" value={tryFormatDate(item.flexget.added_on)} />
        <InfoItem label="Release On" value={tryFormatDate(item.tvdb.releaseDate)} />
        <Typography variant="h6">Next Up</Typography>
        <form onSubmit={(e) => onSubmit(e)} id="movieForm">
          <Typography variant="h6">Override TVDB Name</Typography>
          <TextField
            autoFocus
            margin="dense"
            id="movie"
            label="Movie Name"
            required
            defaultValue={item.flexget.name}
            disabled={editLoading || deleteLoading}
            inputRef={nameRef}
            fullWidth
          />
          <Typography variant="h6">Override TVDB Year</Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Year"
              views={['year']}
              value={year}
              onChange={(newValue: Date | null) => {
                setYear(newValue);
              }}
              disabled={editLoading || deleteLoading}
              renderInput={(params) => (
                <TextField disabled={editLoading || deleteLoading} className={classes.yearInput} required {...params} />
              )}
            />
          </LocalizationProvider>
        </form>
      </>
    </ItemEditor>
  );
};

export default MovieEditor;
