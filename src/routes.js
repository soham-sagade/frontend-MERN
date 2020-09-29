import React from'react'
import {BrowserRouter,Switch,Route} from 'react-router-dom'
import Login from './pages/login/'
import Dashboard from './pages/dashboard/'
import Register from './pages/Register/'
import Events from './EventsPages/'
import MyRegistration from './pages/My Registration/index'
function Routes() {
    return (
        <div>            
                <Switch>
                    <Route path = "/" exact component = {Dashboard} /> 
                    <Route path = "/myregistration" exact component = {MyRegistration} />
                    <Route path = "/login" exact component = {Login} />
                    <Route path = "/registration" exact component = {Register} />
                    <Route path = "/Events" exact component = {Events} />
                </Switch>
        </div>
    )
}

export default Routes

