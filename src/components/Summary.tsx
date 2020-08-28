import React from "react";
import { useTranslation, Trans } from "react-i18next";
import "react-day-picker/lib/style.css";
import dateFnsFormat from "date-fns/format";
import dateFnsParse from "date-fns/parse";
import { DateUtils } from "react-day-picker";
import "../locales/numeral";

export const Summary = (props: any) => {
  //localization
  const { t } = useTranslation();

  // summary variables
  const formattedTransactionsCount = props.transactionsCount;
  const formattedExpensesCount = props.expensesCount;
  const formattedIncomesCount = props.incomesCount;
  const hiddenTransactions =
    formattedTransactionsCount - props.transactionsCountTotalFiltered;
  const hiddenIncomes = formattedIncomesCount - props.incomesCountTotalFiltered;
  const hiddenExpenses =
    formattedExpensesCount - props.expensesCountTotalFiltered;
  return (
    <div className="summary">
      <p
        className={
          formattedTransactionsCount > 0 ? "summary__first-row" : "hidden"
        }
      >
        <Trans
          i18nKey="summary.sum"
          values={{
            transactionsSumTotalFiltered: props.transactionsSumTotalFiltered,
            incomesSumTotalFiltered: props.incomesSumTotalFiltered,
            expensesSumTotalFiltered: props.expensesSumTotalFiltered,
          }}
          components={{ bold: <strong /> }}
        ></Trans>
      </p>
      <p
        className={
          formattedTransactionsCount > 0 ? "summary__first-row" : "hidden"
        }
      >
        <Trans
          i18nKey="summary.count"
          values={{
            transactionsCountTotalFiltered:
              props.transactionsCountTotalFiltered,
            incomesCountTotalFiltered: props.incomesCountTotalFiltered,
            expensesCountTotalFiltered: props.expensesCountTotalFiltered,
          }}
          components={{ bold: <strong /> }}
        ></Trans>
      </p>
      <p
        className={
          formattedTransactionsCount > 0 ? "summary__second-row" : "hidden"
        }
      >
        <Trans
          i18nKey="summary.hidden"
          values={{
            hiddenTransactions: hiddenTransactions,
            hiddenIncomes: hiddenIncomes,
            hiddenExpenses: hiddenExpenses,
          }}
          components={{ bold: <strong /> }}
        ></Trans>
      </p>
      <p
        className={
          formattedTransactionsCount > 0 ? "hidden" : "summary__second-row"
        }
      >
        {t("summary.no-transactions")}
      </p>
    </div>
  );
};
