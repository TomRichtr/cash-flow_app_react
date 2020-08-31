import React from "react";
import { useTranslation } from "react-i18next";
import { TransactionState } from "../actions/transactions";
import numeral from "numeral";
import "../locales/numeral";
import moment from "moment";
import Col from "react-bootstrap/Col";
require("moment/locale/cs");

export const TransactionListItem = (transaction: TransactionState) => {
  const { t, i18n } = useTranslation();
  const convertedDate = () => {
    return moment(transaction.createdAt).format("DD.MM.YYYY");
  };
  moment.updateLocale("cs", {
    monthsShort: [
      "leden",
      "únor",
      "březen",
      "duben",
      "květen",
      "červen",
      "červenec",
      "srpen",
      "září",
      "říjen",
      "listopad",
      "prosinec",
    ],
  });

  const type =
    transaction.type === "income"
      ? t("list-item.income")
      : t("list-item.expense");

  return (
    <div
      className={
        transaction.type === "income" ? "list-item income" : "list-item expense"
      }
    >
      <div className="row transaction-item-line">
        <Col sm="2">
          <p className="list-item__top type">{type}</p>
        </Col>
        <Col sm="2">
          <p className="list-item__top createdAt">{convertedDate()}</p>
        </Col>
        <Col sm="5">
          <p className="list-item__top description">
            {transaction.description}
          </p>
        </Col>
        <Col sm="3">
          <p className="list-item__top amount">
            {numeral(transaction.amount).format("$0,00.00")}
          </p>
        </Col>
      </div>
    </div>
  );
};
