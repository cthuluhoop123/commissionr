import {
    Typography,
    CircularProgress,
    Fade
} from '@material-ui/core';
import styles from '../Css/progress.module.css';

function Progressbar({ data, status }) {
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
                    </div>
                </div>
            );
        });
    };

    return (
        <Fade in={true} mountOnEnter unmountOnExit>
            <div className={`${styles.progressBar} ${['Cancelled', 'Paused', 'Finished'].includes(status) ? styles.finished : ''}`}>
                {render()}
            </div>
        </Fade>
    );
}

export default Progressbar;