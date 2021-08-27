import {
    Typography,
    Card,
    CardContent
} from '@material-ui/core';
import styles from '../../Css/progress.module.css';

function Progressbar({ data }) {
    return (
        <div className={styles.progressBar}>
            {data.map(progressData => {
                return (
                    <div className={styles.progressItem}>
                        <div className={styles.stepper}>
                            <div className={styles.ballAndDate}>
                                <div className={styles.date}>
                                    {progressData.date}
                                </div>
                                <div className={styles.circle} />
                            </div>
                            <div className={styles.line} />
                        </div>
                        <div className={styles.content}>
                            <strong>{progressData.title}</strong>
                            <Typography>{progressData.description}</Typography>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default Progressbar;