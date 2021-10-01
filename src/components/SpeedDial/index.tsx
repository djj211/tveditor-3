import React from 'react';
import Box from '@mui/material/Box';
import MuiSpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import CloseIcon from '@mui/icons-material/Close';

interface SpeedDialItem {
  icon: React.ReactNode;
  name: string;
  onClick: () => void;
}

interface Props {
  actions: SpeedDialItem[];
  icon: React.ReactNode;
}

const SpeedDial = ({ actions, icon }: Props) => {
  return (
    <Box sx={{ transform: 'translateZ(0px)', flexGrow: 1 }}>
      <MuiSpeedDial ariaLabel="Deluge" icon={<SpeedDialIcon icon={icon} openIcon={<CloseIcon />} />}>
        {actions.map((action) => (
          <SpeedDialAction key={action.name} icon={action.icon} tooltipTitle={action.name} />
        ))}
      </MuiSpeedDial>
    </Box>
  );
};

export default SpeedDial;
