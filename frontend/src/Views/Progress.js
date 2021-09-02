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
    FormControlLabel,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    NativeSelect
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
    const [updateTitlesData, setUpdateTitlesData] = useState(null);
    const [updateTitles, setUpdateTitles] = useState(null);

    const [updateTitle, setUpdateTitle] = useState('');
    const [updateDescription, setUpdateDescription] = useState('');
    const [saveUpdate, setSaveUpdate] = useState(false);

    const [showAdd, setShowAdd] = useState(false);

    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!updateTitlesData) { return; }
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

    const updateStatus = e => {
        // TODO: loading bar stuff
        return request
            .post(process.env.REACT_APP_API + '/commission/edit', {
                status: e.target.value,
                id: commissionId
            })
            .then(res => {
                setCommissionData({ ...commissionData, status: res.data.status });
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
                        loading={!updateTitlesData}
                        loadingText='Loading...'
                        options={updateTitles || []}
                        renderInput={(params) => {
                            params.inputProps.autoCapitalize = 'on';
                            return <TextField
                                {...params}
                                autoFocus
                                label='Update title'
                                margin='dense'
                                variant='outlined'
                            />;
                        }}
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
                            {
                                edit
                                    ? (
                                        <div className={styles.editStatus}>
                                            <h2 className={styles.status}>Status:</h2>
                                            <FormControl
                                                className={styles.select}
                                                variant='outlined'
                                            >
                                                <Select
                                                    onChange={updateStatus}
                                                    value={commissionData.status || 'waiting'}
                                                >
                                                    <MenuItem value='Waiting'>Waiting</MenuItem>
                                                    <MenuItem value='In Progress'>In Progress</MenuItem>
                                                    <MenuItem value='Finished'>Finished</MenuItem>
                                                    <MenuItem value='Cancelled'>Cancelled</MenuItem>
                                                    <MenuItem value='Paused'>Paused</MenuItem>
                                                </Select>
                                            </FormControl>
                                            <FormControl
                                                className={styles.nativeSelect}
                                                variant='outlined'
                                            >
                                                <Select
                                                    native
                                                    onChange={updateStatus}
                                                    value={commissionData.status || 'waiting'}
                                                >
                                                    <option value='Waiting'>Waiting</option>
                                                    <option value='In Progress'>In Progress</option>
                                                    <option value='Finished'>Finished</option>
                                                    <option value='Cancelled'>Cancelled</option>
                                                    <option value='Paused'>Paused</option>
                                                </Select>
                                            </FormControl>
                                        </div>
                                    )
                                    : <h2 className={styles.status}>Status: {commissionData.status || 'Waiting'}</h2>
                            }
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