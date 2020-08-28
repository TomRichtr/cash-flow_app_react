import React, { useState, useEffect } from "react";
import { Route, Redirect, withRouter } from "react-router-dom";
import { Header } from "../components/Header";
import { bool, any, object } from "prop-types";
import { RootState } from "../store/configureStore";
import { useSelector } from "react-redux";

const PrivateRoutes = ({ component: Component, ...rest }: any) => {
  const logInStatus = useSelector((state: RootState) => state.authsReducer);
  //@ts-ignore
  const [isLoggedIn, setLoggedIn] = useState(logInStatus.logStatus);

  useEffect(() => {
    //@ts-ignore
    if (logInStatus.logStatus) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, []);

  return (
    <Route
      {...rest}
      component={(props: any) =>
        isLoggedIn ? (
          <div>
            <Header />
            <Component {...props} />
          </div>
        ) : (
          <Redirect to={"/"} />
        )
      }
    />
  );
};

PrivateRoutes.propTypes = {
  component: any,
  isLoggedIn: bool,
  rest: object,
  props: object,
};

export default withRouter(PrivateRoutes);
