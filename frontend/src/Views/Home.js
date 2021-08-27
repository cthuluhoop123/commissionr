import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Progressbar from '../Components/Progressbar/Progressbar.js';

import styles from '../Css/progress.module.css';

const progressData = [
    {
        title: 'Coloring',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '
            + 'Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.',
        date: new Date().toLocaleDateString()
    },
    {
        title: 'Some design revision',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '
            + 'Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.',
        date: new Date().toLocaleDateString()
    },
    {
        title: 'Sketching',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '
            + 'Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.',
        date: new Date().toLocaleDateString()
    }
];

function Home() {
    return (
        <>
            <h1>Pachirisa's progress:</h1>
            <h2>Status: Waiting list</h2>
            <Progressbar data={progressData} />
        </>
    );
}

export default Home;