import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { logInfo, storeEmail, storeUID } from "../actions/auth";
import { Link } from "react-router-dom";
import { googleAuthProvider, firebase } from "../firebase/firebase";

export const LoginPage = () => {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setErrors] = useState("");
  const history = useHistory();
  const dispatch = useDispatch();

  const handleForm = (e: any) => {
    e.preventDefault();
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(() => {
        firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then((res: any) => {
            //@ts-ignore
            if (res.user) dispatch(logInfo(true));
            //@ts-ignore
            dispatch(storeEmail(firebase.auth().currentUser?.email));
            //@ts-ignore
            dispatch(storeUID(firebase.auth().currentUser?.uid));
            history.push("/dashboard");
          })
          .catch((e: any) => {
            setErrors(e.message);
          });
      });
  };

  const handleGoogleLogin = (e: any) => {
    e.preventDefault();
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(() => {
        firebase
          .auth()
          .signInWithPopup(googleAuthProvider)
          .then((res: any) => {
            //@ts-ignore
            if (res.user) dispatch(logInfo(true));
            //@ts-ignore
            dispatch(storeEmail(firebase.auth().currentUser?.email));
            //@ts-ignore
            dispatch(storeUID(firebase.auth().currentUser?.uid));
            history.push("/dashboard");
          })
          .catch((e: any) => {
            setErrors(e.message);
          });
      });
  };

  return (
    <div className="l-background">
      <div className="l-background__box">
        <Form onSubmit={(e: any) => handleForm(e)}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </Form.Group>
          {error}
          <Form.Group className="log-in__buttons">
            <Button
              className="log-in__button-1"
              variant="primary"
              type="submit"
            >
              Log in
            </Button>
            <Button variant="danger" onClick={(e: any) => handleGoogleLogin(e)}>
              Log in with Google
            </Button>
          </Form.Group>
        </Form>
        <Link className="register-link" to="/register">
          You don´t have an account? Please register.
        </Link>
      </div>
    </div>
  );
};
