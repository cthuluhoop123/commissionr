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
    DialogActions,
    makeStyles,
    Checkbox,
    FormControlLabel
} from '@material-ui/core';

import { Autocomplete } from '@material-ui/lab';

const pastInputs = ['Coloring', 'Sketching'];

const usePaperStyles = makeStyles({
    root: {
        padding: '5px 10px'
    }
});

function Progress({ edit = false }) {
    const paperClasses = usePaperStyles();
    const { snack } = useContext(CustomSnackContext);

    const { id: commissionId } = useParams();

    const [commissionData, setCommissionData] = useState(null);
    const [updates, setUpdates] = useState(null);
    const [updateTitlesData, setUpdateTitlesData] = useState([]);
    const [updateTitles, setUpdateTitles] = useState([]);

    const [updateTitle, setUpdateTitle] = useState('');
    const [updateDescription, setUpdateDescription] = useState('');
    const [saveUpdate, setSaveUpdate] = useState(false);

    const [showAdd, setShowAdd] = useState(false);

    const [open, setOpen] = useState(false);

    useEffect(() => {
        setUpdateTitles(updateTitlesData.map(update => update.title));
    }, [updateTitlesData]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setShowAdd(false)
        setUpdateTitle('');
        setUpdateDescription('');
    };

    const createUpdate = () => {
        return request
            .post(process.env.REACT_APP_API + '/commission/createUpdate', {
                id: commissionId,
                title: updateTitle,
                description: updateDescription,
                saveTitle: saveUpdate
            })
            .then(res => {
                setUpdates([{ ...res.data, created_at: new Date() }].concat(updates))
                fetchUpdateTitles();
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

    const fetchUpdateTitles = () => {
        return request
            .get(process.env.REACT_APP_API + '/commission/updateTitles')
            .then(res => {
                setUpdateTitlesData(res.data);
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
        request
            .get(process.env.REACT_APP_API + '/commission', {
                params: {
                    id: commissionId
                }
            })
            .then(res => {
                setCommissionData(res.data);
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


    useEffect(() => {
        request
            .get(process.env.REACT_APP_API + '/commission/updates', {
                params: {
                    id: commissionId
                }
            })
            .then(res => {
                setUpdates(res.data);
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

    useEffect(() => {
        fetchUpdateTitles();
    }, []);

    return (
        <div className='content'>
            <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
                <DialogTitle id='form-dialog-title'>Create an update</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Create an update that your client will see.
                    </DialogContentText>
                    <Autocomplete
                        freeSolo
                        options={updateTitles}
                        renderInput={(params) => (
                            <TextField {...params} label='Update title' margin='dense' variant='outlined' />
                        )}
                        onInputChange={(event, newInputValue) => {
                            setUpdateTitle(newInputValue);
                            if (newInputValue && !updateTitles.includes(newInputValue)) {
                                setShowAdd(true);
                            } else {
                                setShowAdd(false)
                            }
                        }}
                    />
                    {
                        showAdd
                            ? (
                                <FormControlLabel
                                    control={<Checkbox
                                        onChange={e => {
                                            setSaveUpdate(e.target.checked);
                                        }} />}
                                    label='Add this as an option'
                                />
                            )
                            : null
                    }
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
                        <div>
                            <h1>{commissionData.artist.artist_name}'s progress:</h1>
                            <h2 className={styles.status}>Status: {commissionData.status || 'Waiting'}</h2>
                            <a target='_blank' rel='noreferrer' href={process.env.REACT_APP_URL + '/a/' + commissionData.tracking_id}>Tracking link</a>
                            <p />
                        </div>
                    )
                    : null
            }
            {
                edit
                    ? (
                        <Button
                            size='small'
                            disableElevation
                            variant='outlined'
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
        </div >
    );
}

export default Progress;