import { useState, useContext, useEffect } from 'react';

import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    TextField,
    DialogActions,
    Checkbox,
    FormControlLabel,
} from '@material-ui/core';

import { Autocomplete } from '@material-ui/lab';

import styles from '../Css/progress.module.css';

import request from 'axios';

import { CustomSnackContext } from './Snackbar.js';

function EditUpdateDialog({
    updateId,
    initialTitle = '',
    initialDescription = '',
    initialImages = [],
    open = false,
    setOpen,
    onClose = () => { }
}) {
    const { snack } = useContext(CustomSnackContext);

    const [updateTitles, setUpdateTitles] = useState(null);

    const [loadingAddUpdate, setLoadingAddUpdate] = useState(false);

    const [showAdd, setShowAdd] = useState(false);

    const [updateTitle, setUpdateTitle] = useState(initialTitle);
    const [updateDescription, setUpdateDescription] = useState(initialDescription);
    const [saveUpdate, setSaveUpdate] = useState(false);
    const [updateTitlesData, setUpdateTitlesData] = useState(null);

    const [images, setImages] = useState(initialImages);

    useState(() => {
        setUpdateTitle(initialTitle);
    }, [initialTitle]);

    useState(() => {
        setUpdateDescription(initialDescription)
    }, [initialDescription]);

    useState(() => {
        setImages(initialImages);
    }, [initialImages]);

    const handleClose = completed => {
        setOpen(false);
        setShowAdd(false)
        setUpdateTitle('');
        setUpdateDescription('');
        setImages([]);
        onClose(completed === true);
    };

    const getSignedData = id => {
        return new Promise((resolve, reject) => {
            request
                .get(process.env.REACT_APP_API + '/commission/getSignedUrl', {
                    params: { id: updateId }
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
                if (image.size >= 5e6) {
                    return;
                }
                return getSignedData(updateId)
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
                    });
            })
        );
    }

    const editUpdate = () => {
        setLoadingAddUpdate(true);
        return request
            .post(process.env.REACT_APP_API + '/commission/editUpdate', {
                id: updateId,
                title: updateTitle,
                description: updateDescription,
                clearImages: true
            })
            .then(res => {
                return res.data;
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
        fetchUpdateTitles();
    }, []);

    useEffect(() => {
        if (!updateTitlesData) { return; }
        setUpdateTitles(updateTitlesData.map(update => update.title));
    }, [updateTitlesData]);

    return (
        <>
            <Dialog open={open} onClose={() => handleClose(false)} aria-labelledby='form-dialog-title'>
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
                            params.inputProps.value = updateTitle;
                            return <TextField
                                {...params}
                                required
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
                                    style={{
                                        display: 'flex'
                                    }}
                                    control={
                                        <Checkbox
                                            onChange={e => {
                                                setSaveUpdate(e.target.checked);
                                            }}
                                        />
                                    }
                                    label='Add this as an option'
                                />
                            )
                            : null
                    }
                    <TextField
                        variant='outlined'
                        value={updateDescription}
                        margin='dense'
                        multiline
                        id='name'
                        label='Update description'
                        fullWidth
                        onChange={e => {
                            setUpdateDescription(e.target.value);
                        }}
                    />
                    <Button
                        variant='outlined'
                        size='small'
                        component='label'
                    >
                        Reselect images
                        <input
                            onChange={e => {
                                if (e.target.files.length > 3) {
                                    snack({
                                        severity: 'warning',
                                        description: 'You can only upload a max of 3 files per update (each 5mb max).'
                                    })
                                }
                                setImages([...e.target.files].slice(0, 3));
                            }}
                            type='file'
                            multiple
                            accept='image/*'
                            hidden
                        />
                    </Button>
                    <div className={styles.imageGroup}>
                        {
                            images.map(file => {
                                if (file instanceof File) {
                                    const url = URL.createObjectURL(file);
                                    return <img className={`${file.size >= 5e6 ? styles.tooBig : ''}`} src={url} height='50px' />;
                                }
                                if (typeof file === 'string') {
                                    return <img src={file} height='50px' />;
                                }
                            })
                        }
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => handleClose(false)}
                        color='primary'
                        disabled={loadingAddUpdate}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            editUpdate()
                                .then(update => {
                                    return upload(update.id);
                                })
                                .then(() => {
                                    handleClose(true);
                                })
                                .catch(err => {
                                    if (err.response) {
                                        snack({
                                            severity: 'error',
                                            description: err.response.data.error
                                        });
                                    }
                                })
                                .finally(() => setLoadingAddUpdate(false));
                        }}
                        color='primary'
                        disabled={!updateTitle || updateDescription.length >= 255 || loadingAddUpdate}
                    >
                        Edit update{loadingAddUpdate ? '...' : null}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default EditUpdateDialog;