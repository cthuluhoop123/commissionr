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

import styles from '../Css/commissionTable.module.css';

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

function Commission({ commissions }) {
    const cellClasses = useCellStyle();
    const rowClasses = useRowStyle();
    const headClasses = useHeadStyles();
    const tableClasses = useTableStyles();

    if (!commissions) {
        return <p>...</p>;
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
                                            Waiting
                                        </Typography>
                                    </div>
                                </TableCell>
                                <TableCell className={cellClasses.root}>
                                    <div className={styles.row}>
                                        <strong className={styles.responsiveTbName}>Client</strong>
                                        <Typography variant='body2'>
                                            Mary Antoinette
                                        </Typography>
                                    </div>
                                </TableCell>
                                <TableCell className={cellClasses.root}>
                                    <div className={styles.row}>
                                        <strong className={styles.responsiveTbName}>Tags</strong>
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
        </div>
    );
}

export default Commission;