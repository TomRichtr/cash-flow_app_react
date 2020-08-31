import Flag from "react-world-flags";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logInfo } from "../actions/auth";
import { RootState } from "../store/configureStore";
import { firebase } from "../firebase/firebase";

export const Header = () => {
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  const history = useHistory();
  const [error, setErrors] = useState("");
  const [email, setEmail] = useState();
  const dispatch = useDispatch();

  const authenticationInfo = useSelector(
    (state: RootState) => state.authsReducer
  );

  useEffect(() => {
    //@ts-ignore
    setEmail(authenticationInfo.email);
  }, []);

  const onClicklogOut = () => {
    //@ts-ignore
    firebase
      .auth()
      .signOut()
      .then(() => {
        //@ts-ignore
        dispatch(logInfo(false));
        history.push("/");
      })
      .catch((e: any) => {
        setErrors(e.message);
      });
  };

  return (
    <div className="header sticky-top">
      <div className="header-left-side">
        <Link className="header-left-side__main-link" to="/dashboard">
          {t("header.homepage-link")}
        </Link>
        <Link className="header-left-side__secondary-link-text" to="#">
          {t("header.signed-in-as")} {email}
        </Link>
        <Link className="header-left-side__secondary-link-icon" to="#">
          <i className="fas fa-user" title={email}></i>
        </Link>
        <Link
          to=""
          onClick={() => {
            onClicklogOut();
          }}
          className="header-left-side__secondary-link-text"
        >
          {t("header.log-out")}
        </Link>
        <Link
          className="header-left-side__secondary-link-icon"
          to=""
          onClick={() => {
            onClicklogOut();
          }}
        >
          <i className="fas fa-sign-out-alt" title={t("header.log-out")}></i>
        </Link>
      </div>
      <div className="header-right-side">
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
    </div>
  );
};
