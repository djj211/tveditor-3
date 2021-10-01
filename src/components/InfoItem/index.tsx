import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';

const useStyles = makeStyles((theme) => ({
  infoItem: {
    marginTop: 5,
  },
}));

const InfoItem = ({ label, value, color }: { label: string; value: string; color?: string }) => {
  const classes = useStyles();

  return (
    <div className={classes.infoItem}>
      <Typography variant="h6">{label}</Typography>
      <div style={{ color: color ? color : '' }}>{value}</div>
    </div>
  );
};

export default InfoItem;
