import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import { FormPage } from "../components/FormPage";
import { NotFoundPage } from "../components/NotFoundPage";
import { TransactionsListPage } from "../components/TransactionsListPage";
import { LoginPage } from "../components/LoginPage";
import { RegistrationPage } from "../components/RegistrationPage";
import PrivateRoutes from "../routers/PrivateRoutes";

export const history = createBrowserHistory();

const AppRouter = () => {
  return (
    <Router history={history}>
      <div>
        <Switch>
          <Route path="/" component={LoginPage} exact={true} />
          <Route path="/register" component={RegistrationPage} />
          <PrivateRoutes path="/dashboard" component={TransactionsListPage} />
          <PrivateRoutes path="/add_transaction" component={FormPage} />
          <PrivateRoutes path="/edit_transaction/:id" component={FormPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </div>
    </Router>
  );
};
export default AppRouter;
