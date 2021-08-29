import { createContext, useContext, useState } from 'react';

import { Snackbar } from '@material-ui/core';

import { Alert } from '@material-ui/lab';

const CustomSnackContext = createContext({
    snackOpen: false,
    snackData: {},
    snack: () => { },
    close: () => { },
});

function useCustomSnackbar() {
    const [snackOpen, setSnack] = useState(false);
    const [snackData, setSnackData] = useState({});
    const snack = ({ variant = 'filled', severity = 'success', description = '' }) => {
        setSnack(true);
        setSnackData({
            variant,
            severity,
            description
        });
    };

    return {
        snackOpen,
        snack,
        snackData,
        close: () => {
            setSnack(false);
        }
    };
}

function CustomSnackbar({ open, data, close }) {
    return (
        <Snackbar open={open} autoHideDuration={3000} onClose={close}>
            <Alert onClose={close} variant={data.variant} severity={data.severity}>
                {data.description}
            </Alert>
        </Snackbar>
    );
}
export { CustomSnackbar, useCustomSnackbar, CustomSnackContext };