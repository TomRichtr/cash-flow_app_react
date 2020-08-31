import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className="not-found">
      <p className="not-found__title">{t("404.title")}</p>
      <Link className="not-found__link" to="/dashboard">
        {t("404.link")}
      </Link>
    </div>
  );
};
