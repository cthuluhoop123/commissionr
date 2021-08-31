import { useState, useEffect, useContext } from 'react';

import {
    Redirect,
    Link,
    useRouteMatch,
    useParams,
    Switch,
    Route
} from 'react-router-dom';

import Progress from './Progress.js';
import Edit from './Edit.js';

function Commission() {
    const { path } = useRouteMatch();

    return (
        <Switch>
            <Route path={path + '/new'} component={Edit} />
            <Route path={path + '/edit'} component={Edit} />
            <Route path={path} component={Progress} />
        </Switch>
    );
}

export default Commission;