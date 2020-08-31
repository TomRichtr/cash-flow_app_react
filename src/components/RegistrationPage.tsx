import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { logInfo } from "../actions/auth";
import { useDispatch } from "react-redux";
import { firebase } from "../firebase/firebase";
import Flag from "react-world-flags";

export const RegistrationPage = () => {
  const { t, i18n } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVerify, setPasswordVerify] = useState("");
  const [error, setErrors] = useState("");

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

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
      <div className="log-in-flags">
        <button
          className="header-right-side__language-button"
          onClick={() => {
            changeLanguage("en");
          }}
        >
          <Flag code="gb" height="20" width="30" />
        </button>
        <button
          className="header-right-side__language-button"
          onClick={() => {
            changeLanguage("cs");
          }}
        >
          <Flag code="cz" height="20" width="30" />
        </button>
      </div>
      <div className="l-background__box">
        <div className="l-background__box title">
          <span>C</span>A<span>S</span>H<span> F</span>L<span>O</span>W
        </div>
        <Form onSubmit={(e: any) => handleForm(e)}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>{t("login.chooseEmail")}</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>{t("login.password")}</Form.Label>
            <Form.Control
              name="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            {error}
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>{t("login.passwordVerification")}</Form.Label>
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
              {t("login.SignUp")}
            </Button>
          </Form.Group>
        </Form>
        <Link className="register-link" to="/">
          {t("login.backToLoginPage")}
        </Link>
      </div>
    </div>
  );
};
