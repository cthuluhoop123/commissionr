import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Chip,
    Avatar,
    makeStyles,
    StylesProvider
} from '@material-ui/core';

import { ExpandMore } from '@material-ui/icons';

function Commission({ name }) {
    return (
        <div>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>{name}</Typography>
                    <Chip
                        variant="outlined"
                        size="small"
                        avatar={<Avatar alt="Natacha" src="/static/images/avatar/1.jpg" />}
                        label="Deletable"
                    />
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                        sit amet blandit leo lobortis eget.
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}

export default Commission;