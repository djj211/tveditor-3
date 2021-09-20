import React from "react";
import { Switch, Route, Redirect, RouteProps, Router  } from "react-router-dom";
import { createBrowserHistory } from "history";
import { useToasts } from "react-toast-notifications";
import { useAuth } from "./Context/auth.context";
import Shows from './components/Shows';
import Login from "./components/Login";

const history = createBrowserHistory();

const ProtectedRoute = (props: RouteProps ) => {
    const { checkAuthenticated } = useAuth();
    const { addToast } = useToasts();
    const authenticated = checkAuthenticated();

    React.useEffect(() => {
      if (!authenticated) {
        addToast("You must login to access that resource!", { appearance: 'error' });
      }
    }, [authenticated]);

    if(authenticated) {
        return <Route {...props} />;
     } else {
        return <Redirect to="/login" />;
    }
}

const LoggedInRedirectRoute = (props: RouteProps ) => {
  const { checkAuthenticated } = useAuth();

  if(checkAuthenticated()) {
    return <Redirect to="/" />;
   } else {
    return <Route {...props} />;
  }
}

const AppRoutes = () => {
    return (
        <Router history={history}>
          <Switch>
            <LoggedInRedirectRoute path="/login" component={Login} />
            <ProtectedRoute path="/" component={Shows} />
          </Switch>
        </Router>
    );
 }

 export default AppRoutes;
