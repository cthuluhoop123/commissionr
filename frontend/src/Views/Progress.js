import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';

import request from 'axios';

import Progressbar from '../Components/Progressbar.js';

import styles from '../Css/progress.module.css';

import { CustomSnackContext } from '../Components/Snackbar.js';

import CreateUpdateDialog from '../Components/CreateUpdateDialog.js';

import {
    Button,
    makeStyles,
    FormControl,
    Select,
    MenuItem,
    CircularProgress
} from '@material-ui/core';

import { Launch } from '@material-ui/icons';

const pastInputs = ['Coloring', 'Sketching'];

const usePaperStyles = makeStyles({
    root: {
        padding: '5px 10px'
    }
});

function Progress({ edit = false }) {
    const { snack } = useContext(CustomSnackContext);

    const { id: commissionId } = useParams();

    const [commissionData, setCommissionData] = useState(null);
    const [updates, setUpdates] = useState(null);

    const [loadingStatus, setLoadingStatus] = useState(false);

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
                edit && commissionData
                    ? (
                        <CreateUpdateDialog
                            commissionId={commissionData.id}
                            onClose={completed => {
                                if (completed) {
                                    fetchUpdates();
                                }
                            }}
                        />
                    )
                    : null
            }
            {
                updates
                    ? (
                        <Progressbar
                            data={updates}
                            status={commissionData ? commissionData.status : null}
                        />
                    )
                    : null
            }
        </div >
    );
}

export default Progress;