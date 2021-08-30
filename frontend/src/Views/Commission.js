import { useState, useEffect, useContext } from 'react';

import { Redirect, Link } from 'react-router-dom';

import {
    TextField,
    Typography,
    Avatar,
    Button,
    makeStyles
} from '@material-ui/core';

import styles from '../Css/commission.module.css';

import request from 'axios';

import { CustomSnackContext } from '../Components/Snackbar.js';

function Commission(props) {
    const target = props.match.params.id;


    const { snack } = useContext(CustomSnackContext);

    const [done, setDone] = useState(false);

    const [commissionName, setCommissionName] = useState('');
    const [clientName, setClientName] = useState('');

    const [formErrors, setFormErrors] = useState({
        commissionName: false,
        clientName: false,
    });

    useEffect(() => {
        if (!target) { return; }

        request
            .get(process.env.REACT_APP_API + '/user/commission', {
                params: {
                    id: target
                }
            })
            .then(res => {
                setCommissionName(res.data.name);
                setClientName(res.data.client_name);
            });
    }, [target]);

    const validate = () => {
        let canProceed = true;

        const errors = {
            commissionName: false,
            clientName: false,
        };

        if (!commissionName) {
            errors.commissionName = 'Project name required!';
            canProceed = false;
        }
        if (!clientName) {
            errors.clientName = 'Client name required!';
            canProceed = false;
        }

        setFormErrors(errors);
        return canProceed;
    };

    const createCommission = () => {
        if (target) {
            request
                .post(process.env.REACT_APP_API + '/user/editCommission', {
                    id: target,
                    projectName: commissionName,
                    clientName
                })
                .then(res => setDone(true))
                .catch(err => {
                    if (err.response) {
                        snack({
                            severity: 'error',
                            description: err.response.data.error
                        });
                    }
                });
        } else {
            request
                .post(process.env.REACT_APP_API + '/user/createCommission', {
                    projectName: commissionName,
                    clientName
                })
                .then(res => setDone(true))
                .catch(err => {
                    if (err.response) {
                        snack({
                            severity: 'error',
                            description: err.response.data.error
                        });
                    }
                });
        }
    };

    if (done) {
        return <Redirect push to='/dash' />;
    }

    return (
        <div className='content'>
            <div className='heading'>
                <Typography component='h1' variant='h5'>
                    Create new commission
                </Typography>
            </div>
            <div className={styles.form}>
                <form noValidate>
                    <div className={styles.formGroup}>
                        <TextField
                            required
                            value={commissionName}
                            label='Project name'
                            variant='outlined'
                            helperText={formErrors.commissionName}
                            error={!!formErrors.commissionName}
                            onChange={e => {
                                setCommissionName(e.target.value);
                            }}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <TextField
                            required
                            value={clientName}
                            label='Client name'
                            variant='outlined'
                            helperText={formErrors.clientName}
                            error={!!formErrors.clientName}
                            onChange={e => {
                                setClientName(e.target.value);
                            }}
                        />
                    </div>
                    <div className='formActions'>
                        {
                            target
                                ? (
                                    <>
                                        <Button
                                            size='large'
                                            disableElevation
                                            variant='contained'
                                            color='primary'
                                            onClick={() => {
                                                if (validate()) {
                                                    createCommission();
                                                }
                                            }}
                                        >
                                            Edit commission
                                        </Button>
                                        <Link to='/dash'>
                                            <Button
                                                size='large'
                                                disableElevation
                                                variant='contained'
                                                color='secondary'
                                            >
                                                Cancel
                                            </Button>
                                        </Link>
                                    </>
                                )
                                : (
                                    <Button
                                        size='large'
                                        disableElevation
                                        variant='contained'
                                        color='primary'
                                        onClick={() => {
                                            if (validate()) {
                                                createCommission();
                                            }
                                        }}
                                    >
                                        Create commission
                                    </Button>
                                )
                        }
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Commission;