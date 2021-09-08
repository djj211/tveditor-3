import React from "react";
import AddIcon from '@material-ui/icons/Add';

import FabButton from "./";

interface Props {
    onClick: () => void;
}

const AddButton = ({ onClick }: Props) => {

    return (
        <FabButton onClick={onClick}>
            <AddIcon />
        </FabButton>
    )
}

export default AddButton;