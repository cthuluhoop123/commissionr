import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';

import request from 'axios';

import Progressbar from '../Components/Progressbar.js';

import styles from '../Css/progress.module.css';

import { CustomSnackContext } from '../Components/Snackbar.js';


function Track() {
    const { snack } = useContext(CustomSnackContext);

    const { trackingId } = useParams();

    const [commissionData, setCommissionData] = useState(null);
    const [updates, setUpdates] = useState(null);

    useEffect(() => {
        Promise.all(
            [
                request
                    .get(process.env.REACT_APP_API + '/commission/trackingUpdates', {
                        params: {
                            trackingId
                        }
                    })
                    .then(res => {
                        setUpdates(res.data);
                    }),
                request
                    .get(process.env.REACT_APP_API + '/commission/track', {
                        params: {
                            trackingId
                        }
                    })
                    .then(res => {
                        setCommissionData(res.data);
                    })
            ]
        ).catch(err => {
            if (err.response) {
                snack({
                    severity: 'error',
                    description: err.response.data.error
                });
            }
        });
    }, []);

    return (
        <div className='content'>
            {
                commissionData
                    ? (
                        <>
                            <h1>{commissionData.artist.artist_name}'s progress:</h1>
                            <h2 className={styles.status}>Status: {commissionData.status || 'Waiting'}</h2>
                        </>
                    )
                    : null
            }
            {
                updates
                    ? <Progressbar data={updates} finished={commissionData && commissionData.status === 'Finished'} />
                    : null
            }
        </div>
    );
}

export default Track;