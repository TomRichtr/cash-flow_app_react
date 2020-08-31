import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/configureStore";
import { TransactionListItem } from "./TransactionListItem";
import { Link, useHistory } from "react-router-dom";
import row from "react-bootstrap/row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";
import dateFnsFormat from "date-fns/format";
import dateFnsParse from "date-fns/parse";
import { DateUtils } from "react-day-picker";
import {
  setFrom,
  setTo,
  sortBy,
  setTypeFilter,
  setTextFilter,
  resetFilters,
} from "../actions/filters";
import { Summary } from "./Summary";
import { database } from "../firebase/firebase";
import { TransactionState } from "../actions/transactions";

function parseDate(str: any, format: any, locale: any) {
  const parsed = dateFnsParse(str, format, new Date(), { locale });
  if (DateUtils.isDate(parsed)) {
    return parsed;
  }
  return undefined;
}

function formatDate(date: any, format: any, locale: any) {
  return dateFnsFormat(date, format, { locale });
}

interface DocState {
  id: string;
}

export const TransactionsListPage = () => {
  console.log("bum");
  //localization
  const { t, i18n } = useTranslation();
  const FORMAT = "dd.MM.yyyy";
  const MONTHS =
    i18n.language === "cs"
      ? [
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
        ]
      : undefined;
  const WEEKDAYS_SHORT =
    i18n.language === "cs"
      ? ["Po", "Út", "St", "Čt", "Pá", "So", "Ne"]
      : undefined;
  //redux consts
  const history = useHistory();
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.filtersReducer);
  const authenticationInfo = useSelector(
    (state: RootState) => state.authsReducer
  );

  const [transactions, setTransactions] = useState<TransactionState[]>([]);

  const [filteredTransactions, setFilterTransactions] = useState<
    TransactionState[]
  >([]);

  const [type, setFilterType] = useState<string>("");
  const [text, setFilterText] = useState<string>("");
  const [sort, bySort] = useState<"date" | "amount">("date");
  const [from, setFromState] = useState<Date | undefined>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [to, setToState] = useState<Date | undefined>(new Date());
  const [
    transactionsSumTotalFiltered,
    callculateTransactionsSumTotalFiltered,
  ] = useState<number>(0);
  const [incomesSumTotalFiltered, callculateIncomesSumTotalFiltered] = useState<
    number
  >(0);
  const [
    expensesSumTotalFiltered,
    callculateExpensesSumTotalFiltered,
  ] = useState<number>(0);
  const [
    transactionsCountTotalFiltered,
    callculateTransactionsCountTotalFiltered,
  ] = useState<number>(0);
  const [
    incomesCountTotalFiltered,
    callculateIncomesCountTotalFiltered,
  ] = useState<number>(0);
  const [
    expensesCountTotalFiltered,
    callculateExpensesCountTotalFiltered,
  ] = useState<number>(0);

  const [transactionsCount, callculateTransactionsCount] = useState<number>(0);
  const [incomesCount, callculateIncomesCount] = useState<number>(0);
  const [expensesCount, callculateExpensesCount] = useState<number>(0);

  //Day Picker consts and functions
  const modifiers = { start: from, end: to };
  const onChangeSetFrom = (day: any) => {
    dispatch(setFrom(day));
    setFromState(day);
  };
  const onChangeSetTo = (day: any) => {
    dispatch(setTo(day));
    setToState(day);
  };
  const addNewTransaction = () => {
    history.push("/add_transaction/");
  };

  const setTransactionsList = async () => {
    const transactionsCollection = database.collection(authenticationInfo.uid);
    const snapshot = await transactionsCollection.get();
    const transactionArray = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    //@ts-ignore
    setTransactions(transactionArray);
  };

  useEffect(() => {
    setTransactionsList();
  }, []);

  //Filters
  useEffect(() => {
    let result = transactions;

    if (filters.types === "expense") {
      result = result.filter(function (transaction: TransactionState) {
        return transaction.type === "expense";
      });
    }

    if (filters.types === "income") {
      result = result.filter(function (transaction: TransactionState) {
        return transaction.type === "income";
      });
    }

    if (filters.text !== "") {
      result = result.filter(function (transaction: TransactionState) {
        return transaction.description
          .toLowerCase()

          .includes(filters.text.toLowerCase());
      });
    }

    if (filters.sortBy === "amount") {
      result = result.sort((a: TransactionState, b: TransactionState) => {
        return a.amount < b.amount ? 1 : -1;
      });
    }

    if (filters.sortBy === "date") {
      result = result.sort((a: TransactionState, b: TransactionState) => {
        return a.createdAt < b.createdAt ? 1 : -1;
      });
    }

    if (filters.from) {
      result = result.filter(function (transaction: TransactionState) {
        return transaction.createdAt >= Date.parse(filters.from);
      });
    }

    if (filters.to) {
      result = result.filter(function (transaction: TransactionState) {
        return transaction.createdAt <= Date.parse(filters.to);
      });
    }
    setFilterTransactions(result);

    const transactionsTotalFiltered = result.reduce(
      (sum: number, transaction: TransactionState) => sum + transaction.amount,
      0
    );
    callculateTransactionsSumTotalFiltered(transactionsTotalFiltered);
    const incomesTotalFiltered = result
      .filter(function (transaction: TransactionState) {
        return transaction.type === "income";
      })
      .reduce(
        (sum: number, income: TransactionState) => sum + income.amount,
        0
      );
    callculateIncomesSumTotalFiltered(incomesTotalFiltered);
    const expensesTotalFiltered = result
      .filter(function (transaction: TransactionState) {
        return transaction.type === "expense";
      })
      .reduce(
        (sum: number, expense: TransactionState) => sum + expense.amount,
        0
      );
    callculateExpensesSumTotalFiltered(expensesTotalFiltered);
    const transactionsCountFiltered = result.length;
    callculateTransactionsCountTotalFiltered(transactionsCountFiltered);
    const incomesCountFiltered = result.filter(function (
      transaction: TransactionState
    ) {
      return transaction.type === "income";
    }).length;
    callculateIncomesCountTotalFiltered(incomesCountFiltered);
    const expensesCountFiltered = result.filter(function (
      transaction: TransactionState
    ) {
      return transaction.type === "expense";
    }).length;
    callculateExpensesCountTotalFiltered(expensesCountFiltered);

    const transactionsCountTotal = transactions.length;

    callculateTransactionsCount(transactionsCountTotal);

    const incomesCountTotal = transactions.filter(function (
      transaction: TransactionState
    ) {
      return transaction.type === "income";
    }).length;

    callculateIncomesCount(incomesCountTotal);

    const expensesCountTotal = transactions.filter(function (
      transaction: TransactionState
    ) {
      return transaction.type === "expense";
    }).length;
    callculateExpensesCount(expensesCountTotal);
  }, [filters, transactions]);

  //Action functions
  const getTransactionToEdit = (e: any, id: any) => {
    e.preventDefault();
    history.push("/edit_transaction/" + id);
  };
  const onClickReset = () => {
    dispatch(resetFilters());
    setToState(undefined);
    setFromState(undefined);
    setFilterType("");
    setFilterText("");
    bySort("date");
  };
  const onChoiceSetTypeFilter = (e: any) => {
    dispatch(setTypeFilter(e));
    setFilterType(e);
  };
  const onTypingSetDescriptionFilter = (e: any) => {
    dispatch(setTextFilter(e));
    setFilterText(e);
  };

  const onChoiceSetSorting = (e: any) => {
    dispatch(sortBy(e));
    bySort(e);
  };

  return (
    <div className="transaction-list">
      <Summary
        transactionsCountTotalFiltered={transactionsCountTotalFiltered}
        incomesCountTotalFiltered={incomesCountTotalFiltered}
        expensesCountTotalFiltered={expensesCountTotalFiltered}
        transactionsSumTotalFiltered={transactionsSumTotalFiltered}
        incomesSumTotalFiltered={incomesSumTotalFiltered}
        expensesSumTotalFiltered={expensesSumTotalFiltered}
        transactionsCount={transactionsCount}
        incomesCount={incomesCount}
        expensesCount={expensesCount}
      />
      <button
        onClick={() => {
          addNewTransaction();
        }}
        className="dashboard__button"
      >
        {t("buttons.add-transaction")}
      </button>
      <Form className="transactions-list__filters">
        <Form.Group as={row}>
          <Col sm="4" className="transactions-list__filters--first-row">
            <Form.Control
              onChange={(e: any) => onChoiceSetTypeFilter(e.target.value)}
              as="select"
              defaultValue={""}
              value={type}
              className="transactions-list__filters--first-row-input"
            >
              <option value="">
                {t("filters.typeSelect.allTransactions")}
              </option>
              <option value="income">{t("filters.typeSelect.incomes")}</option>
              <option value="expense">
                {t("filters.typeSelect.expenses")}
              </option>
            </Form.Control>
          </Col>

          <Col sm="8">
            <Form.Control
              className=""
              type="text"
              value={text}
              placeholder={t("filters.textFilter")}
              onChange={(e: any) =>
                onTypingSetDescriptionFilter(e.target.value)
              }
            />
          </Col>
        </Form.Group>
        <Form.Group as={row}>
          <Col sm="2">
            <DayPickerInput
              clickUnselectsDay
              value={from}
              onDayChange={(day: any) => onChangeSetFrom(day)}
              placeholder="from"
              formatDate={formatDate}
              format={FORMAT}
              parseDate={parseDate}
              inputProps={{
                className: "form__calendar from",
                style: { width: "100%" },
              }}
              dayPickerProps={{
                toMonth: to,
                months: MONTHS,
                weekdaysShort: WEEKDAYS_SHORT,
                modifiers,
              }}
            />
          </Col>
          <Col sm="2">
            <DayPickerInput
              clickUnselectsDay
              value={to}
              placeholder="To"
              formatDate={formatDate}
              format={FORMAT}
              parseDate={parseDate}
              inputProps={{
                className: "form__calendar from",
                style: { width: "100%" },
              }}
              onDayChange={(day: any) => onChangeSetTo(day)}
              dayPickerProps={{
                month: from,
                modifiers,
                fromMonth: from,
                months: MONTHS,
                weekdaysShort: WEEKDAYS_SHORT,
              }}
            />
          </Col>
          <Col sm="7">
            <Form.Control
              className="sorting"
              onChange={(e: any) => onChoiceSetSorting(e.target.value)}
              as="select"
              defaultValue={"date"}
              value={sort}
            >
              <option value="amount">{t("filters.sort.sortByAmount")}</option>
              <option value="date">{t("filters.sort.sortByDate")}</option>
            </Form.Control>
          </Col>
          <Col className="transactions-list__filters--second-row reset" sm="1">
            <a onClick={() => onClickReset()}>Reset</a>
          </Col>
        </Form.Group>
      </Form>
      {filteredTransactions.map((transaction: TransactionState) => (
        <Link
          onClick={(e) => {
            getTransactionToEdit(e, transaction.id);
          }}
          className={transaction.type === "income" ? "income" : "expense"}
          to={""}
        >
          <TransactionListItem key={transaction.id} {...transaction} />
        </Link>
      ))}
    </div>
  );
};
