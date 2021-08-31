import { Route, Switch } from 'react-router-dom';


import Progress from './Views/Progress.js';
import Home from './Views/Home.js';
import Signup from './Views/Signup.js';
import Login from './Views/Login.js';
import Dash from './Views/Dash.js';
import Commission from './Views/Commission/Commission.js';
import Track from './Views/Track.js';

import request from 'axios';

import { CustomSnackbar, useCustomSnackbar, CustomSnackContext } from './Components/Snackbar.js';

request.defaults.withCredentials = true;

function App() {
    const {
        snackOpen,
        snackData,
        snack,
        close,
    } = useCustomSnackbar();

    return (
        <>
            <CustomSnackContext.Provider
                value={{
                    snackOpen,
                    snackData,
                    snack,
                    close
                }}
            >
                <Switch>
                    <Route path='/commission/:id?' component={Commission} />
                    <Route path='/a/:trackingId' component={Track} />
                    <Route path='/dash' component={Dash} />
                    <Route path='/signup' component={Signup} />
                    <Route path='/login' component={Login} />
                    <Route path='/progress' component={Progress} />
                    <Route path='/' component={Home} />
                    <Route path='/*'>
                        <h1>what</h1>
                    </Route>
                </Switch>
                <CustomSnackbar data={snackData} open={snackOpen} close={close} />
            </CustomSnackContext.Provider>
        </>
    );
}

export default App;
