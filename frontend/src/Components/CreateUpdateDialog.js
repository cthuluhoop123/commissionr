import { useState } from 'react';

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

function CreateUpdateDialog() {
    const [updateTitles, setUpdateTitles] = useState(null);

    const [loadingAddUpdate, setLoadingAddUpdate] = useState(false);


    const [showAdd, setShowAdd] = useState(false);

    const [open, setOpen] = useState(false);
    
    const handleClose = () => {
        setOpen(false);
        setShowAdd(false)
        setUpdateTitle('');
        setUpdateDescription('');
    };

    return (
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
                    + Add images
                    <input
                        onChange={e => {
                            setImages([...e.target.files]);
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
                            const url = URL.createObjectURL(file);
                            return <img src={url} height='50px' />;
                        })
                    }
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color='primary'>
                    Cancel
                </Button>
                <Button
                    onClick={() => {
                        createUpdate()
                            .then(update => {
                                return upload(update.id);
                            })
                            .then(() => {
                                handleClose();
                                fetchUpdates();
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
                    Create update{loadingAddUpdate ? '...' : null}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default CreateUpdateDialog;