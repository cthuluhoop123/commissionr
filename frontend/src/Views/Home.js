import { useState, useEffect } from 'react';

import {
    TextField,
    Typography,
    Avatar,
    Button,
    Snackbar
} from '@material-ui/core';

import { Alert } from '@material-ui/lab';

import AccessibleForwardIcon from '@material-ui/icons/AccessibleForward';

import styles from '../Css/Home.module.css';

import request from 'axios';

function Home() {
    const [email, setEmail] = useState('')
    const [artistName, setArtistName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [formErrors, setFormErrors] = useState({
        email: false,
        artistName: false,
        password: false,
        confirmPassword: false
    });

    const [snackOpen, setSnackOpen] = useState(false);

    const open = () => setSnackOpen(true);
    const close = () => setSnackOpen(false);

    const validate = () => {
        let canProceed = true;

        const errors = {
            email: false,
            artistName: false,
            password: false,
            confirmPassword: false
        };

        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            errors.email = 'Invalid email';
            canProceed = false;
        }

        if (!artistName) {
            errors.artistName = 'Invalid name';
            canProceed = false;
        }

        if (!password || !confirmPassword) {
            errors.password = 'Invalid password';
            errors.confirmPassword = 'Invalid password';
            canProceed = false;
        }

        if (password !== confirmPassword) {
            errors.password = 'Password do not match!';
            errors.confirmPassword = 'Password do not match!';
            canProceed = false;
        }

        setFormErrors(errors);
        return canProceed;
    };

    const register = () => {
        open();
    };

    return (
        <div className={styles.content}>
            <div className={styles.heading}>
                <Avatar className={styles.avatar}>
                    <AccessibleForwardIcon />
                </Avatar>
                <Typography component='h1' variant='h5'>
                    Create an account
                </Typography>
            </div>
            <div className={styles.form}>
                <form noValidate autoComplete='off'>
                    <div className={styles.formGroup}>
                        <TextField
                            required
                            fullWidth
                            label='Email'
                            variant='outlined'
                            onChange={e => setEmail(e.target.value)}
                            error={!!formErrors.email}
                            helperText={formErrors.email}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <TextField
                            required
                            fullWidth
                            label='Artist Handle'
                            variant='outlined'
                            onChange={e => setArtistName(e.target.value)}
                            error={!!formErrors.artistName}
                            helperText={formErrors.artistName}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <TextField
                            required
                            fullWidth
                            label='Password'
                            type='password'
                            variant='outlined'
                            onChange={e => setPassword(e.target.value)}
                            error={!!formErrors.password}
                            helperText={formErrors.password}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <TextField
                            required
                            fullWidth
                            label='Confirm Password'
                            type='password'
                            variant='outlined'
                            onChange={e => setConfirmPassword(e.target.value)}
                            error={!!formErrors.confirmPassword}
                            helperText={formErrors.confirmPassword}
                        />
                    </div>
                    <Button
                        size='large'
                        disableElevation
                        variant='contained'
                        color='primary'
                        fullWidth
                        onClick={() => {
                            if (validate()) {
                                register();
                            }
                        }}
                    >
                        Create account
                    </Button>
                </form>
                <Snackbar open={snackOpen} autoHideDuration={6000} onClose={close}>
                    <Alert onClose={close} variant='filled' severity='success'>
                        Registered!
                    </Alert>
                </Snackbar>
            </div>
        </div>
    );
}

export default Home;