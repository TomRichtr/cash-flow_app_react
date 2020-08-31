import React from "react";
import { useTranslation } from "react-i18next";

export const LoadingPage = () => {
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return <div className="l-background"></div>;
};
