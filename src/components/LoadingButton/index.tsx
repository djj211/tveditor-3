import React from "react";
import Button, { ButtonProps } from '@material-ui/core/Button';
import CircularProgress from "@material-ui/core/CircularProgress";

interface Props extends ButtonProps {
    loading: boolean;
}

const LoadingButton = ({ loading, type, color, form, onClick, children }: Props) => {
    return (            
        <Button type={type} color={color} form={form} onClick={onClick}>
            {loading ? <CircularProgress size={20} /> : children}           
        </Button>
    )
}

export default LoadingButton;
