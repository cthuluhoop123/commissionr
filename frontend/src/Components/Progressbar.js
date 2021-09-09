import { useState, useEffect } from 'react';

import {
    Typography,
    CircularProgress,
    Fade,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from '@material-ui/core';

import request from 'axios';

import styles from '../Css/progress.module.css';

import LoadableImage from './LoadableImage.js';
import EditUpdateDialog from './EditUpdateDialog';

function Progressbar({
    data,
    status,
    edit = false,
    fetchUpdates
}) {
    const [editTarget, setEditTarget] = useState(null);
    const [open, setOpen] = useState(false);

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handleClose = () => {
        setDeleteConfirmationOpen(false);
    };

    const deleteUpdate = updateId => {
        setDeleteLoading(true);
        return request
            .post(process.env.REACT_APP_API + '/commission/deleteUpdate', {
                id: updateId,
            })
            .then(res => {
                fetchUpdates();
            })
            .finally(() => setDeleteLoading(false));
    };

    const render = () => {
        if (!data) {
            return (
                <div>
                    <CircularProgress />
                </div>
            );
        }

        if (!data.length) {
            return (
                <div>
                    <p>Nothing yet...</p>
                </div>
            );
        }
        return data.map((progressData, i) => {
            const date = new Date(progressData.created_at);
            const dateString = date.toLocaleDateString();
            const timeString = date.toLocaleString(undefined, { hour: 'numeric', minute: 'numeric', hour12: true });
            return (
                <>
                    <div key={i} className={`${styles.progressItem} ${i === 0 && status !== 'Finished' ? styles.focused : ''}`}>
                        <div className={styles.stepper}>
                            <div className={styles.ballAndDate}>
                                <div className={styles.date}>
                                    {dateString}
                                    <br />
                                    {timeString}
                                </div>
                                <div className={`${styles.circle}`} />
                            </div>
                            <div className={styles.line} />
                        </div>
                        <div className={styles.content}>
                            <div className={`${styles.responsiveDate}`}>
                                {dateString} • {timeString}
                            </div>
                            <span className={styles.title}>{progressData.title}</span>
                            <Typography className={styles.description}>{progressData.description}</Typography>
                            {
                                edit
                                    ? (
                                        <div className={styles.buttonGroup}>
                                            <Button
                                                color='primary'
                                                variant='outlined'
                                                size='small'
                                                onClick={e => {
                                                    setEditTarget(progressData);
                                                    setOpen(true);
                                                }}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                color='secondary'
                                                variant='outlined'
                                                size='small'
                                                onClick={() => {
                                                    setDeleteConfirmationOpen(true);
                                                    setDeleteTarget(progressData.id);
                                                    // deleteUpdate(progressData.id);
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    )
                                    : null
                            }
                            {
                                progressData.images.length
                                    ? <LoadableImage images={progressData.images} />
                                    : null
                            }
                        </div>
                    </div>
                </>

            );
        });
    };

    return (
        <Fade in={true} mountOnEnter unmountOnExit>
            <div className={`${styles.progressBar} ${['Cancelled', 'Paused', 'Finished'].includes(status) ? styles.finished : ''}`}>
                <Dialog
                    open={deleteConfirmationOpen}
                    onClose={handleClose}
                    aria-labelledby='alert-dialog-title'
                    aria-describedby='alert-dialog-description'
                >
                    <DialogTitle>Are you sure you want to delete this update?</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            This action is not reversible.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={handleClose}
                            color='primary'
                            disabled={deleteLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                deleteUpdate(deleteTarget)
                                    .then(() => {
                                        handleClose();
                                    });
                            }}
                            color='primary'
                            autoFocus
                            disabled={deleteLoading}
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
                {render()}
                {
                    edit && editTarget
                        ? (
                            <EditUpdateDialog
                                updateId={editTarget.id}
                                initialTitle={editTarget.title}
                                initialDescription={editTarget.description}
                                initialImages={editTarget.images}
                                open={open}
                                setOpen={setOpen}
                                onClose={completed => {
                                    setEditTarget(null);
                                    if (completed) {
                                        fetchUpdates();
                                    }
                                }}
                            />
                        )
                        : null
                }
            </div>
        </Fade>
    );
}

export default Progressbar;