import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { logInfo } from "../actions/auth";
import { useDispatch } from "react-redux";
import { firebase } from "../firebase/firebase";

export const RegistrationPage = () => {
  const { t, i18n } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVerify, setPasswordVerify] = useState("");
  const [error, setErrors] = useState("");

  const handleForm = (e: any) => {
    e.preventDefault();
    if (password === passwordVerify) {
      firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(() => {
          firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then((res) => {
              //@ts-ignore
              if (res.user) dispatch(logInfo(true));
              //@ts-ignore
              dispatch(storeEmail(firebase.auth().currentUser?.email));
              history.push("/dashboard");
            })
            .catch((e) => {
              setErrors(e.message);
            });
        });
    } else {
      setErrors("Passwords doesn´t match!");
    }
  };

  return (
    <div className="l-background">
      <div className="l-background__box">
        <Form onSubmit={(e: any) => handleForm(e)}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Insert email address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Choose your password</Form.Label>
            <Form.Control
              name="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            {error}
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Insert password again</Form.Label>
            <Form.Control
              name="passwordVerify"
              type="password"
              onChange={(e) => setPasswordVerify(e.target.value)}
              value={passwordVerify}
            />
            {error}
          </Form.Group>

          <Form.Group className="log-in__buttons">
            <Button
              className="log-in__button-1"
              variant="primary"
              type="submit"
            >
              Sign Up
            </Button>
          </Form.Group>
        </Form>
        <Link className="register-link" to="/">
          Already have an account? Please click here.
        </Link>
      </div>
    </div>
  );
};
