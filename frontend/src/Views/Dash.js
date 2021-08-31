import { useContext, useEffect, useState } from 'react';

import {
    Button,
    Typography,
    useMediaQuery
} from '@material-ui/core';

import { Link } from 'react-router-dom';

import Commission from '../Components/Commission.js';

import styles from '../Css/dash.module.css';

import request from 'axios';

import { CustomSnackContext } from '../Components/Snackbar.js';

function Dash() {
    const { snack } = useContext(CustomSnackContext);

    const [commissions, setCommissions] = useState(null);

    useEffect(() => {
        request
            .get(process.env.REACT_APP_API + '/commission/all', { withCredentials: true })
            .then(res => {
                setCommissions(res.data);
            })
            .catch(err => {
                if (err.response) {
                    snack({
                        severity: 'error',
                        description: err.response.data.error
                    });
                }
            });
    }, []);

    return (
        <div className='content'>
            <div className='heading'>
                <Typography component='h1' variant='h5'>
                    Your commissions
                </Typography>
            </div>
            <div className={styles.actions}>
                <Link to='/commission/new'>
                    <Button
                        disableElevation
                        variant='contained'
                        color='primary'
                    >
                        Create new commission
                    </Button>
                </Link>
            </div>
            <Commission commissions={commissions} />
        </div>
    );
}

export default Dash;