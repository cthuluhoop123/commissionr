import { useState } from 'react';

import { Skeleton } from '@material-ui/lab';

import styles from '../Css/loadableimage.module.css';

function LoadableImage({ images }) {
    const [loadingState, setLoadingState] = useState(images.map(() => true));

    const setLoaded = i => {
        const newLoadingState = [...loadingState];
        newLoadingState[i] = false;
        setLoadingState(newLoadingState);
    }

    return (
        <div className={styles.attachments}>
            {
                images.map((image, i) => {
                    return (
                        <>
                            <div className={`${styles.placeHolder} ${!loadingState[i] ? styles.loading : ''}`}>
                                <Skeleton variant='rect' width={149.65} height={100} />
                            </div>
                            <img
                                className={loadingState[i] ? styles.loading : ''}
                                onLoad={() => {
                                    setLoaded(i);
                                }}
                                key={image}
                                src={image}
                            />
                        </>
                    );
                })
            }
        </div>
    );
}

export default LoadableImage;