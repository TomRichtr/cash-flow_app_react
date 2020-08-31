import React from "react";
import { useTranslation, Trans } from "react-i18next";
import "../locales/numeral";
import numeral from "numeral";

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
            transactionsSumTotalFiltered: numeral(
              props.transactionsSumTotalFiltered
            ).format("$0,00.00"),
            incomesSumTotalFiltered: numeral(
              props.incomesSumTotalFiltered
            ).format("$0,00.00"),
            expensesSumTotalFiltered: numeral(
              props.expensesSumTotalFiltered
            ).format("$0,00.00"),
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
