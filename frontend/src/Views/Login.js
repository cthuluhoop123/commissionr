import { useState, useEffect, useContext } from 'react';

import { Redirect } from 'react-router-dom';

import {
    TextField,
    Typography,
    Avatar,
    Button
} from '@material-ui/core';

import AccessibleForwardIcon from '@material-ui/icons/AccessibleForward';

import styles from '../Css/Home.module.css';

import request from 'axios';

import { CustomSnackContext } from '../Components/Snackbar.js';

function Signup() {
    const { snack } = useContext(CustomSnackContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loggedIn, setLoggedIn] = useState(false);

    const [formErrors, setFormErrors] = useState({
        email: false,
        password: false,
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
        if (!password) {
            errors.password = 'Invalid password';
            errors.confirmPassword = 'Invalid password';
            canProceed = false;
        }

        setFormErrors(errors);
        return canProceed;
    };

    const login = () => {
        request.post(process.env.REACT_APP_API + '/auth/login', {
            email,
            password
        }).then(res => {
            snack({
                description: 'Successfully logged in!'
            });
            setTimeout(() => setLoggedIn(true), 500);
        }).catch(err => {
            if (err.response) {
                snack({
                    severity: 'error',
                    description: err.response.data.error
                });
            }
        });
    };

    if (loggedIn) {
        return <Redirect to='/dash' />;
    }

    return (
        <div className={styles.content}>
            <div className={styles.heading}>
                <Avatar className={styles.avatar}>
                    <AccessibleForwardIcon />
                </Avatar>
                <Typography component='h1' variant='h5'>
                    Log in
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
                            label='Password'
                            type='password'
                            variant='outlined'
                            onChange={e => setPassword(e.target.value)}
                            error={!!formErrors.password}
                            helperText={formErrors.password}
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
                                login();
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