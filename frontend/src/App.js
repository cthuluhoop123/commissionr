import { Route, Switch } from 'react-router-dom';
import Progress from './Views/Progress.js';
import Home from './Views/Home.js';
import Signup from './Views/Signup.js';
import Login from './Views/Login.js';
import Dash from './Views/Dash.js';

import { CustomSnackbar, useCustomSnackbar, CustomSnackContext } from './Components/Snackbar.js';

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
                    <Route exact path='/' component={Home} />
                    <Route exact path='/dash' component={Dash} />
                    <Route exact path='/signup' component={Signup} />
                    <Route exact path='/login' component={Login} />
                    <Route exact path='/progress' component={Progress} />
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
