import { useState, useEffect, useContext } from 'react';

import {
    TextField,
    Typography,
    Avatar,
    Button
} from '@material-ui/core';

import { Redirect, Link } from 'react-router-dom';

import AccessibleForwardIcon from '@material-ui/icons/AccessibleForward';

import styles from '../Css/signup.module.css';

import request from 'axios';

import { CustomSnackContext } from '../Components/Snackbar.js';

function Signup() {
    const { snack } = useContext(CustomSnackContext);

    const [email, setEmail] = useState('');
    const [artistName, setArtistName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [signedUp, setSignedUp] = useState(false);

    const [formErrors, setFormErrors] = useState({
        email: false,
        artistName: false,
        password: false,
        confirmPassword: false
    });

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
        request.post(process.env.REACT_APP_API + '/auth/register', {
            email,
            artistName,
            password
        }).then(res => {
            snack({
                description: 'Thanks for signing up!'
            });
            setSignedUp(true);
        }).catch(err => {
            if (err.response) {
                snack({
                    severity: 'error',
                    description: err.response.data.error
                });
            }
        });
    };

    if (signedUp) {
        return <Redirect to='/dash' />
    }

    return (
        <div className={styles.content}>
            <div className='heading'>
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
                    <div className={styles.extras}>
                        <Link to='/login'>Log into your account</Link>
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
            </div>
        </div>
    );
}

export default Signup;