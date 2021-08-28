import Progressbar from '../Components/Progressbar/Progressbar.js';

import styles from '../Css/progress.module.css';

const progressData = {
    artistName: 'Pachirisa_',
    status: 'Doing',
    updates: [{
        title: 'Coloring',
        description: 'Please hold on!',
        date: new Date().toLocaleDateString()
    },
    {
        title: 'Some design revision',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '
            + 'Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.',
        date: new Date(Date.now() - 1000 * 60 * 60 * 48).toLocaleDateString()
    },
    {
        title: 'Sketching',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '
            + 'Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.',
        date: new Date(Date.now() - 1000 * 60 * 60 * 96).toLocaleDateString()
    }]
};

function Progress() {
    return (
        <div className='content'>
            <h1>{progressData.artistName}'s progress:</h1>
            <h2 className={styles.status}>Status: {progressData.status}</h2>
            <Progressbar data={progressData.updates} />
        </div>
    );
}

export default Progress;