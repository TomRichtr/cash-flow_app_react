import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { logInfo, storeEmail, storeUID } from "../actions/auth";
import { Link } from "react-router-dom";
import { googleAuthProvider, firebase } from "../firebase/firebase";
import Flag from "react-world-flags";

export const LoginPage = () => {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setErrors] = useState("");
  const history = useHistory();
  const dispatch = useDispatch();
  const [displayResetPassword, setDisplayResetPassword] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

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

  const resetPassword = () => {
    var auth = firebase.auth();

    auth
      .sendPasswordResetEmail(email)
      .then(function () {
        setErrors(`Instructions were sent to an inserted email.`);
      })
      .catch(function (e) {
        setErrors(e.message);
      });
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
      {!displayResetPassword ? (
        <div className="l-background__box">
          <div className="login-title">
            <span>C</span>A<span>S</span>H<span> F</span>L<span>O</span>W
          </div>
          <Form onSubmit={(e: any) => handleForm(e)}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>{t("login.email")}</Form.Label>
              <Form.Control
                type="email"
                placeholder={t("login.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>{t("login.password")}</Form.Label>
              <Form.Control
                type="password"
                placeholder={t("login.passwordPlaceholder")}
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
                {t("login.login")}
              </Button>
              <Button
                variant="danger"
                onClick={(e: any) => handleGoogleLogin(e)}
              >
                {t("login.loginGoogle")}
              </Button>
            </Form.Group>
          </Form>
          <Link className="register-link" to="/register">
            {t("login.registration")}
          </Link>
          <Link
            className="register-link bottom"
            to=""
            onClick={() => setDisplayResetPassword(true)}
          >
            {t("login.resetPassword")}
          </Link>
        </div>
      ) : (
        <div className="l-background__box">
          <div className="l-background__box title">
            <span>C</span>A<span>S</span>H<span> F</span>L<span>O</span>W
          </div>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>{t("login.email")}</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
            />
            {error}
          </Form.Group>
          <Form.Group className="log-in__buttons">
            <Button
              className="log-in__button-1"
              variant="warning"
              type="submit"
              onClick={() => resetPassword()}
            >
              {t("login.resetPasswordButton")}
            </Button>
          </Form.Group>

          <Link
            className="register-link"
            to="/"
            onClick={() => setDisplayResetPassword(false)}
          >
            {t("login.backToLoginPage")}
          </Link>
        </div>
      )}
    </div>
  );
};
