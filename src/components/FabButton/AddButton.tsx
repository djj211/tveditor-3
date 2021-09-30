import React from 'react';
import AddIcon from '@mui/icons-material/Add';

import FabButton from '.';

interface Props {
  onClick: () => void;
  className?: string;
}

const AddButton = ({ onClick, className }: Props) => {
  return (
    <FabButton onClick={onClick} className={className}>
      <AddIcon />
    </FabButton>
  );
};

export default AddButton;
