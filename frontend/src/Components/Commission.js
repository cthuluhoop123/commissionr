import {
    Typography,
    Table,
    TableCell,
    TableContainer,
    Paper,
    TableHead,
    TableRow,
    TableBody,
    makeStyles,
    CircularProgress
} from '@material-ui/core';

import { Link } from 'react-router-dom';

import styles from '../Css/commissionTable.module.css';

const useCellStyle = makeStyles(theme => (
    {
        root: {}
    }
));

const useRowStyle = makeStyles(theme => (
    {
        root: {
            '&:hover': {
                backgroundColor: '#f7f7f7',
                cursor: 'pointer',
                transition: 'background-color 0.5s ease'
            },
            textDecoration: 'none'
        }
    }
));

const useHeadStyles = makeStyles(theme => (
    {
        root: {}
    }
));

const useTableStyles = makeStyles(theme => (
    {
        root: {}
    }
));

function Commission({ commissions }) {
    const cellClasses = useCellStyle();
    const rowClasses = useRowStyle();
    const headClasses = useHeadStyles();
    const tableClasses = useTableStyles();

    if (!commissions) {
        return (
            // haha.
            <div style={{ margin: '2rem auto', width: '5rem' }}>
                <CircularProgress />
            </div>
        );
    }

    return (
        <div className={styles.projectsTable}>
            <TableContainer component={props => <Paper {...props} variant='outlined' />}>
                <Table className={tableClasses.root} aria-label='simple table'>
                    <TableHead className={headClasses.root}>
                        <TableRow>
                            <TableCell><strong>Project</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                            <TableCell><strong>Client</strong></TableCell>
                            <TableCell><strong>Tags</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {commissions.map((commission, i) => (
                            <TableRow
                                component={Link}
                                to={'/commission/' + commission.id}
                                className={rowClasses.root}
                                key={i}
                            >
                                <TableCell className={cellClasses.root} component='th' scope='row'>
                                    <div className={styles.row}>
                                        <Typography variant='body2'>
                                            {commission.name}
                                        </Typography>
                                    </div>
                                </TableCell>
                                <TableCell className={cellClasses.root}>
                                    <div className={styles.row}>
                                        <Typography variant='body2'>
                                            Waiting
                                        </Typography>
                                    </div>
                                </TableCell>
                                <TableCell className={cellClasses.root}>
                                    <div className={styles.row}>
                                        <Typography variant='body2'>
                                            {commission.client_name}
                                        </Typography>
                                    </div>
                                </TableCell>
                                <TableCell className={cellClasses.root}>
                                    <div className={styles.row}>
                                        <Typography variant='body2'>
                                            <i>none yet</i>
                                        </Typography>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div >
    );
}

export default Commission;