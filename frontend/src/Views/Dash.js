import styles from '../Css/dash.module.css';

import {
    Typography,
    Table,
    TableCell,
    TableContainer,
    Paper,
    TableHead,
    TableRow,
    TableBody,
    makeStyles
} from '@material-ui/core';

import Commission from '../Components/Commission.js';

const commissions = [
    {
        name: 'Commissioner 1'
    },
    {
        name: 'Seargent Gilbert'
    },
    {
        name: 'Some other dude'
    },
    {
        name: 'Big boy'
    }
];

const useCellStyle = makeStyles(theme => (
    {
        root: {
            [theme.breakpoints.down('xs')]: {
                display: 'block',
                borderBottom: 'none',
                padding: '10px'
            }
        }
    }
));

const useRowStyle = makeStyles(theme => (
    {
        root: {
            [theme.breakpoints.down('xs')]: {
                borderBottom: '1px solid rgba(224, 224, 224, 1)',
                padding: '1rem'
            }
        }
    }
));

const useHeadStyles = makeStyles(theme => (
    {
        root: {
            [theme.breakpoints.down('xs')]: {
                display: 'none'
            }
        }
    }
));

const useTableStyles = makeStyles(theme => (
    {
        root: {
            [theme.breakpoints.down('xs')]: {
                borderCollapse: 'collapse'
            }
        }
    }
));

function Dash() {
    const cellClasses = useCellStyle();
    const rowClasses = useRowStyle();
    const headClasses = useHeadStyles();
    const tableClasses = useTableStyles();

    return (
        <div className='content'>
            <Typography component='h1' variant='h5'>
                Your commissions
            </Typography>
            <div className={styles.projectsTable}><TableContainer component={props => <Paper {...props} variant='outlined' />}>
                <Table className={tableClasses.root} aria-label='simple table'>
                    <TableHead className={headClasses.root}>
                        <TableRow>
                            <TableCell>Project</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Client</TableCell>
                            <TableCell>Tags</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {commissions.map((commission, i) => (
                            <TableRow className={rowClasses.root} key={i}>
                                <TableCell className={cellClasses.root} component='th' scope='row'>
                                    <div className={styles.row}>
                                        <strong className={styles.responsiveTbName}>Name</strong>
                                        <Typography variant='body2'>
                                            {commission.name}
                                        </Typography>
                                    </div>
                                </TableCell>
                                <TableCell className={cellClasses.root}>
                                    <div className={styles.row}>
                                        <strong className={styles.responsiveTbName}>Status</strong>
                                        <Typography variant='body2'>
                                            {commission.name}
                                        </Typography>
                                    </div>
                                </TableCell>
                                <TableCell className={cellClasses.root}>
                                    <div className={styles.row}>
                                        <strong className={styles.responsiveTbName}>Client</strong>
                                        <Typography variant='body2'>
                                            {commission.name}
                                        </Typography>
                                    </div>
                                </TableCell>
                                <TableCell className={cellClasses.root}>
                                    <div className={styles.row}>
                                        <strong className={styles.responsiveTbName}>Tags</strong>
                                        <Typography variant='body2'>
                                            {commission.name}
                                        </Typography>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            </div>
        </div>
    );
}

export default Dash;