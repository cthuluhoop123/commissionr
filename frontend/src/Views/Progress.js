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
    NativeSelect,
    CircularProgress
} from '@material-ui/core';

import { Launch } from '@material-ui/icons';

import { Autocomplete } from '@material-ui/lab';
import { useRef } from 'react';

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

    const [loadingStatus, setLoadingStatus] = useState(false);
    const [loadingAddUpdate, setLoadingAddUpdate] = useState(false);

    const [updateTitle, setUpdateTitle] = useState('');
    const [updateDescription, setUpdateDescription] = useState('');
    const [saveUpdate, setSaveUpdate] = useState(false);

    const [showAdd, setShowAdd] = useState(false);

    const [open, setOpen] = useState(false);

    const [images, setImages] = useState([]);

    useEffect(() => {
        if (!updateTitlesData) { return; }
        setUpdateTitles(updateTitlesData.map(update => update.title));
    }, [updateTitlesData]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    useEffect(() => console.log('hi'))

    const getSignedData = id => {
        return new Promise((resolve, reject) => {
            request
                .get(process.env.REACT_APP_API + '/commission/getSignedUrl', {
                    params: { id }
                })
                .then(res => {
                    resolve(res.data);
                })
                .catch(reject);
        });
    };

    const upload = id => {
        return Promise.all(
            images.map(image => {
                return getSignedData(id)
                    .then(data => {
                        const form = new FormData();
                        for (const key of Object.keys(data.fields)) {
                            form.append(key, data.fields[key]);
                        }
                        form.append('file', image);
                        return request
                            .post(data.url, form)
                            .then(res => console.log(res))
                            .catch(err => { console.error(err); });
                    })
            })
        );
    }

    const fetchUpdates = () => {
        return request
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
    }

    const createUpdate = () => {
        setLoadingAddUpdate(true);
        return request
            .post(process.env.REACT_APP_API + '/commission/createUpdate', {
                id: commissionId,
                title: updateTitle,
                description: updateDescription,
                saveTitle: saveUpdate
            })
            .then(res => {
                //setUpdates([{ ...res.data, created_at: new Date() }].concat(updates))
                fetchUpdateTitles();
                return res.data;
            });
    };

    const updateStatus = e => {
        // TODO: loading bar stuff
        setLoadingStatus(true);
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
            })
            .finally(() => setLoadingStatus(false));
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
        fetchUpdates();
    }, []);

    useEffect(() => {
        fetchUpdateTitles();
    }, []);

    return (
        <div className='content'>
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
                                            {
                                                loadingStatus
                                                    ? (
                                                        <div className={styles.loader}>
                                                            <CircularProgress size={20} />
                                                        </div>
                                                    )
                                                    : null
                                            }
                                        </div>
                                    )
                                    : <h2 className={styles.status}>Status: {commissionData.status || 'Waiting'}</h2>
                            }
                            <div style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}>
                                <Launch fontSize='small' />
                                <a target='_blank' rel='noreferrer' href={process.env.REACT_APP_URL + '/a/' + commissionData.tracking_id}>
                                    Tracking link
                                </a>
                            </div>
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
                    ? <Progressbar data={updates} status={commissionData ? commissionData.status : null} />
                    : null
            }
        </div >
    );
}

export default Progress;