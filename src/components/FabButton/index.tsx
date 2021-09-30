import React from 'react';
import Fab from '@mui/material/Fab';

interface Props {
  children: React.ReactChild;
  onClick: () => void;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const FabButton = ({ children, onClick, className, size }: Props) => {
  return (
    <div className={className}>
      <Fab color="primary" aria-label="add" size={size} onClick={onClick}>
        {children}
      </Fab>
    </div>
  );
};

export default FabButton;
