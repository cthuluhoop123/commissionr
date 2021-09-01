import { useContext, useState } from 'react';

import { Button } from '@material-ui/core';

import { Link, useParams } from 'react-router-dom';

import CommissionProgress from '../Progress.js';

import { CustomSnackContext } from '../../Components/Snackbar.js';

import request from 'axios';

function Progress(props) {
    const { id } = useParams();

    return (
        <div className='content'>
            <div className='formActions'>
                <Link replace to={`/commission/${id}/edit`}>
                    <Button
                        size='medium'
                        disableElevation
                        variant='outlined'
                        color='primary'
                    >
                        Edit commission
                    </Button>
                </Link>
            </div>
            <CommissionProgress edit />
        </div>
    );
}

export default Progress;