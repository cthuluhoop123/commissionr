import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';

import request from 'axios';

import Progressbar from '../Components/Progressbar.js';

import styles from '../Css/progress.module.css';

import { CustomSnackContext } from '../Components/Snackbar.js';

import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    TextField,
    DialogActions
} from '@material-ui/core';

function Progress({ edit = false }) {
    const { snack } = useContext(CustomSnackContext);

    const { id: commissionId } = useParams();

    const [commissionData, setCommissionData] = useState(null);
    const [updates, setUpdates] = useState(null);

    const [updateTitle, setUpdateTitle] = useState('');
    const [updateDescription, setUpdateDescription] = useState('');

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const createUpdate = () => {
        return request
            .post(process.env.REACT_APP_API + '/commission/createUpdate', {
                id: commissionId,
                title: updateTitle,
                description: updateDescription
            })
            .then(res => {
                setUpdates([{ ...res.data, created_at: new Date() }].concat(updates))
            })
            .catch(err => {
                if (err.response) {
                    snack({
                        severity: 'error',
                        description: err.response.data.error
                    });
                }
            });
    };


    useEffect(() => {
        Promise.all(
            [
                request
                    .get(process.env.REACT_APP_API + '/commission/updates', {
                        params: {
                            id: commissionId
                        }
                    })
                    .then(res => {
                        setUpdates(res.data);
                    }),
                request
                    .get(process.env.REACT_APP_API + '/commission', {
                        params: {
                            id: commissionId
                        }
                    })
                    .then(res => {
                        setCommissionData(res.data);
                    })
            ]
        ).catch(err => {
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

            <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
                <DialogTitle id='form-dialog-title'>Create an update</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Create an update that your client will see.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin='dense'
                        id='name'
                        label='Update title'
                        variant='outlined'
                        type='email'
                        fullWidth
                        onChange={e => {
                            setUpdateTitle(e.target.value);
                        }}
                    />
                    <TextField
                        autoFocus
                        variant='outlined'
                        margin='dense'
                        multiline
                        id='name'
                        label='Update description'
                        type='email'
                        fullWidth
                        onChange={e => {
                            setUpdateDescription(e.target.value);
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color='primary'>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            createUpdate()
                                .then(() => {
                                    handleClose();
                                    setUpdateTitle(false);
                                    setUpdateDescription(false);
                                });
                        }}
                        color='primary'
                    >
                        Create update
                    </Button>
                </DialogActions>
            </Dialog>
            {
                commissionData
                    ? (
                        <>
                            <h1>{commissionData.artist.artist_name}'s progress:</h1>
                            <h2 className={styles.status}>Status: {commissionData.status || 'Waiting'}</h2>
                        </>
                    )
                    : null
            }
            {
                edit
                    ? (
                        <Button
                            size='large'
                            disableElevation
                            variant='contained'
                            color='primary'
                            onClick={handleClickOpen}
                        >
                            Create update
                        </Button>
                    )
                    : null
            }
            {
                updates
                    ? <Progressbar data={updates} />
                    : null
            }
        </div>
    );
}

export default Progress;