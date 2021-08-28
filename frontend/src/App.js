import { Route, Switch } from 'react-router-dom';
import Progress from './Views/Progress.js';

function App() {
    return (
        <Switch>
            <Route exact path='/' component={Progress} />
            <Route path='/*'>
                <h1>what</h1>
            </Route>
        </Switch>
    );
}

export default App;
