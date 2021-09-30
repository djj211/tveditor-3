import React from "react";
import Button, { ButtonProps } from '@mui/material/Button';
import CircularProgress from "@mui/material/CircularProgress";

interface Props extends ButtonProps {
    loading: boolean;
}

const LoadingButton = ({ loading, type, color, form, onClick, children, className }: Props) => {
    return (            
        <Button type={type} color={color} form={form} onClick={onClick} className={className}>
            {loading ? <CircularProgress size={20} /> : children}           
        </Button>
    )
}

export default LoadingButton;
