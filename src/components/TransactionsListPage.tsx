import React, { useState, useEffect } from "react";
import { useTranslation, Trans } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/configureStore";
import { TransactionListItem } from "./TransactionListItem";
import { Link, useHistory } from "react-router-dom";
import { TransactionsState } from "../actions/transactions";
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
import "../locales/numeral";
import numeral from "numeral";
import { Summary } from "./Summary";
import { database, firebase } from "../firebase/firebase";

export interface FilterFormInputs {
  text: string;
  types: string;
  amount: number;
  from: string | undefined;
  to: string | undefined;
}

export interface UseStateVariables {
  transactions: [object];
  filters: object;
  type: string;
  from: number;
  to: number;
  transactionsSumTotalFiltered: number;
  incomesSumTotalFiltered: number;
  expensesSumTotalFiltered: number;
  transactionsCountTotalFiltered: number;
  incomesCountTotalFiltered: number;
  expensesCountTotalFiltered: number;
  transactionsCount: number;
  incomesCount: number;
  expensesCount: number;
}

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

export const TransactionsListPage = () => {
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

  // const transactions = useSelector(
  //   (state: RootState) => state.transactionsReducer
  // );
  const filters = useSelector((state: RootState) => state.filtersReducer);
  const authenticationInfo = useSelector(
    (state: RootState) => state.authsReducer
  );

  const [transactions, setTransactions] = useState([]);

  const [filteredTransactions, setFilterTransactions] = useState<
    UseStateVariables
  >(transactions);
  const [type, setFilterType] = useState<UseStateVariables | "">("");
  const [text, setFilterText] = useState<UseStateVariables | "">("");
  const [sort, bySort] = useState<"date" | "amount">("date");
  const [from, setFromState] = useState<UseStateVariables | undefined>(
    undefined
  );
  const [to, setToState] = useState<UseStateVariables | undefined>(undefined);
  const [
    transactionsSumTotalFiltered,
    callculateTransactionsSumTotalFiltered,
  ] = useState<UseStateVariables>(0);
  const [incomesSumTotalFiltered, callculateIncomesSumTotalFiltered] = useState<
    UseStateVariables
  >();
  const [
    expensesSumTotalFiltered,
    callculateExpensesSumTotalFiltered,
  ] = useState<UseStateVariables>(0);
  const [
    transactionsCountTotalFiltered,
    callculateTransactionsCountTotalFiltered,
  ] = useState<UseStateVariables | 0>(0);
  const [
    incomesCountTotalFiltered,
    callculateIncomesCountTotalFiltered,
  ] = useState<UseStateVariables>(0);
  const [
    expensesCountTotalFiltered,
    callculateExpensesCountTotalFiltered,
  ] = useState<UseStateVariables>(0);

  const [transactionsCount, callculateTransactionsCount] = useState<
    UseStateVariables
  >(0);
  const [incomesCount, callculateIncomesCount] = useState<
    UseStateVariables | 0
  >(0);
  const [expensesCount, callculateExpensesCount] = useState<UseStateVariables>(
    0
  );

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
  useEffect(() => {
    const transactionList = database
      .collection(authenticationInfo.uid)
      .onSnapshot((snapshot) => {
        const allTransactions = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTransactions(allTransactions);
        console.log(allTransactions);
      });
    return () => {
      transactionList();
      console.log(transactionList());
    };
  }, []);
  //Filters
  useEffect(() => {
    const allTransactions = [];
    const transactionList = database
      .collection(authenticationInfo.uid)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          allTransactions.push(doc.data());
        });
      });

    setTransactions(transactionList);

    let result = transactions;

    if (filters.types === "expense") {
      result = result.filter(function (transaction) {
        return transaction.type === "expense";
      });
    }

    if (filters.types === "income") {
      result = result.filter(function (transaction) {
        return transaction.type === "income";
      });
    }

    if (filters.types === "") {
      result = result;
    }

    if (filters.text !== "") {
      result = result.filter(function (transaction) {
        return transaction.description
          .toLowerCase()

          .includes(filters.text.toLowerCase());
      });
    }

    if (filters.sortBy === "amount") {
      result = result.sort((a: TransactionsState, b: TransactionsState) => {
        return a.amount > b.amount ? 1 : -1;
      });
    }

    if (filters.sortBy === "date") {
      result = result.sort((a: TransactionsState, b: TransactionsState) => {
        return a.createdAt > b.createdAt ? 1 : -1;
      });
    }

    if (filters.from) {
      result = result.filter(function (transaction) {
        return transaction.createdAt >= Date.parse(filters.from);
      });
    }

    if (filters.to) {
      result = result.filter(function (transaction) {
        return transaction.createdAt <= Date.parse(filters.to);
      });
    }
    setFilterTransactions(result);

    const transactionsTotalFiltered = result.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );
    callculateTransactionsSumTotalFiltered(
      numeral(transactionsTotalFiltered).format("$0,00.00")
    );
    const incomesTotalFiltered = result
      .filter(function (transaction) {
        return transaction.type === "income";
      })

      .reduce((sum, income) => sum + income.amount, 0);
    callculateIncomesSumTotalFiltered(
      numeral(incomesTotalFiltered).format("$0,00.00")
    );
    const expensesTotalFiltered = result
      .filter(function (transaction) {
        return transaction.type === "expense";
      })

      .reduce((sum, expense) => sum + expense.amount, 0);
    callculateExpensesSumTotalFiltered(
      numeral(expensesTotalFiltered).format("$0,00.00")
    );
    const transactionsCountFiltered = result.length;
    callculateTransactionsCountTotalFiltered(transactionsCountFiltered);
    const incomesCountFiltered = result.filter(function (transaction) {
      return transaction.type === "income";
    }).length;
    callculateIncomesCountTotalFiltered(incomesCountFiltered);
    const expensesCountFiltered = result.filter(function (transaction) {
      return transaction.type === "expense";
    }).length;
    callculateExpensesCountTotalFiltered(expensesCountFiltered);

    const transactionsCountTotal = transactions.length;
    callculateTransactionsCount(transactionsCountTotal);

    const incomesCountTotal = transactions.filter(function (transaction) {
      return transaction.type === "income";
    }).length;

    callculateIncomesCount(incomesCountTotal);

    const expensesCountTotal = transactions.filter(function (transaction) {
      return transaction.type === "expense";
    }).length;
    callculateExpensesCount(expensesCountTotal);
  }, [filters]);
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
              <option value="">All transactions</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </Form.Control>
          </Col>

          <Col sm="8">
            <Form.Control
              className=""
              type="text"
              value={text}
              placeholder="filter by description"
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
                disabledDays: { after: to },
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
                disabledDays: { before: from },
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
              defaultValue="Choose..."
              value={sort}
            >
              <option value="amount">Sort By Amount</option>
              <option value="date">Sort By Date</option>
            </Form.Control>
          </Col>
          <Col className="transactions-list__filters--second-row reset" sm="1">
            <a onClick={() => onClickReset()}>Reset</a>
          </Col>
        </Form.Group>
      </Form>
      {filteredTransactions.map((transaction: TransactionsState) => (
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
