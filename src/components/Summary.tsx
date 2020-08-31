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
          i18nKey="summary.sum-transactions"
          values={{
            transactionsSumTotalFiltered: numeral(
              props.transactionsSumTotalFiltered
            ).format("$0,00.00"),
            transactionsCountTotalFiltered:
              props.transactionsCountTotalFiltered,
            hiddenTransactions: hiddenTransactions,
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
          i18nKey="summary.sum-incomes"
          values={{
            incomesSumTotalFiltered: numeral(
              props.incomesSumTotalFiltered
            ).format("$0,00.00"),
            incomesCountTotalFiltered: props.incomesCountTotalFiltered,
            hiddenIncomes: hiddenIncomes,
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
          i18nKey="summary.sum-expenses"
          values={{
            expensesSumTotalFiltered: numeral(
              Math.abs(props.expensesSumTotalFiltered)
            ).format("$0,00.00"),
            expensesCountTotalFiltered: props.expensesCountTotalFiltered,
            hiddenExpenses: hiddenExpenses,
          }}
          components={{ bold: <strong /> }}
        ></Trans>
      </p>
    </div>
  );
};
