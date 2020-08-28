import Col from "react-bootstrap/Col";
import React, { useEffect, useState } from "react";
import row from "react-bootstrap/row";
import { RootState } from "../store/configureStore";
import { addTransaction } from "../actions/transactions";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  TransactionsState,
  editTransaction,
  removeTransaction,
} from "../actions/transactions";
import Form from "react-bootstrap/Form";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";
import dateFnsFormat from "date-fns/format";
import dateFnsParse from "date-fns/parse";
import { DateUtils } from "react-day-picker";
import moment from "moment";
import { database } from "../firebase/firebase";
import { v4 as uuidv4 } from "uuid";
require("moment/locale/cs");

export interface UseFormInputs {
  amount: number;
  createdAt: string;
  description: string;
  id: string;
  note: string;
  type: string;
}

export interface AuthenticationInputs {
  uid: string;
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

export const FormPage = (props: any) => {
  const { t, i18n } = useTranslation();
  const { register, handleSubmit, reset, control, errors } = useForm<
    UseFormInputs
  >();
  //@ts-ignore
  const [uid, setUID] = useState("");
  const [transactionToEdit, setTransactionToEdit] = useState({});
  const authenticationInfo = useSelector(
    //ts-ignore
    (state: RootState) => state.authsReducer
  );

  useEffect(() => {
    //ts-ignore
    console.log(authenticationInfo.uid);
    //ts-ignore
    setUID(authenticationInfo.uid);
  }, []);

  const dispatch = useDispatch();
  const history = useHistory();
  const FORMAT = "dd.MM.yyyy";
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

  const onSubmitNew = (transaction: TransactionsState) => {
    const transactionId = uuidv4();
    const dateToInput = Date.parse(transaction.createdAt);
    const amountToInput =
      transaction.type === "income"
        ? transaction.amount * 1 // added to prevent redux accepting value as the string
        : transaction.amount * -1;
    dispatch(
      addTransaction({
        ...transaction,
        amount: amountToInput,
        id: transactionId,
      })
    );
    database
      .collection(uid)
      .doc(transactionId)
      .set({
        ...transaction,
        amount: amountToInput,
        createdAt: dateToInput,
      });
    history.push("/dashboard");
  };

  const onSubmitEdit = (updates: TransactionsState) => {
    if (transactionToEdit !== undefined) {
      const amountToInput =
        updates.amount < 0
          ? updates.amount * 1
          : updates.type === "income"
          ? updates.amount * 1
          : updates.amount * -1; //making sure that edited income, will remain negative, no matter of users input
      dispatch(
        editTransaction(props.match.params.id, {
          ...updates,
          amount: amountToInput,
        })
      );
      database
        .collection(uid)
        .doc(props.match.params.id)
        .set({ ...updates, amount: amountToInput });
      history.push("/dashboard");
    }
  };

  const onDeleteClick = () => {
    dispatch(removeTransaction(props.match.params.id));
    database.collection(uid).doc(props.match.params.id).delete();
    history.push("/dashboard");
  };

  useEffect(() => {
    if (props.match.params.id !== undefined) {
      const transactionToEdit = database
        .collection(authenticationInfo.uid)
        .doc(props.match.params.id);
      reset(transactionToEdit);
    }
  }, []);

  return (
    <div className="form__container">
      <Form
        className="form"
        onSubmit={handleSubmit(
          props.match.params.id === undefined ? onSubmitNew : onSubmitEdit
        )}
      >
        <Form.Group as={row} className="form__type--container">
          <Form.Label column sm="2">
            {t("form.type")}
          </Form.Label>
          <Col sm="10">
            <Form.Control
              className="form__type"
              as="select"
              name="type"
              ref={register({ required: true })}
              defaultValue={""}
            >
              <option disabled value="">
                Choose a type
              </option>
              <option value="income">{t("list-item.income")}</option>
              <option value="expense">{t("list-item.expense")}</option>
            </Form.Control>
            {errors.type && "This is required field."}
          </Col>
        </Form.Group>
        <Form.Group as={row} className="form__amount--container">
          <Form.Label column sm="2">
            {t("form.amount")}
          </Form.Label>
          <Col sm="10">
            <Form.Control
              name="amount"
              className="form__amount"
              ref={register({
                required: true,
                pattern: /^[+-]?[0-9]{1,9}(?:\.[0-9]{1,2})?$/,
              })}
            />
            {errors.amount && errors.amount.type === "required" && (
              <span>This is required field.</span>
            )}
            {errors.amount && errors.amount.type === "pattern" && (
              <span>Only a number with two decimals can be used.</span>
            )}
          </Col>
        </Form.Group>
        <Form.Group as={row}>
          <Form.Label column sm="2">
            {t("form.date")}
          </Form.Label>
          <Col sm="10" className="form__calendar--container">
            <Controller
              control={control}
              className="form__calendar"
              name="createdAt"
              render={({ onChange, value }) => (
                <DayPickerInput
                  onDayChange={onChange}
                  value={value}
                  formatDate={formatDate}
                  format={FORMAT}
                  parseDate={parseDate}
                  placeholder={t("form.calendar-placeholder")}
                  inputProps={{
                    className: "form__calendar",
                    style: { width: "100%" },
                  }}
                  dayPickerProps={{
                    months: MONTHS,
                    weekdaysShort: WEEKDAYS_SHORT,
                  }}
                />
              )}
            />
            <p className="form__date--error-message">
              {errors.createdAt && "This is required field."}
            </p>
          </Col>
        </Form.Group>

        <Form.Group as={row} className="form__description--container">
          <Form.Label column sm="2">
            {t("form.description")}
          </Form.Label>
          <Col sm="10">
            <Form.Control
              className=""
              name="description"
              ref={register({ required: true, maxLength: 100 })}
            />
            {errors.description && "This is required field."}
          </Col>
        </Form.Group>
        <Form.Group as={row}>
          <Form.Label column sm="2">
            {t("form.note")}
          </Form.Label>
          <Col sm="10">
            <Form.Control
              as="textarea"
              rows={4}
              className=""
              name="note"
              ref={register({ maxLength: 1000 })}
            />
          </Col>
        </Form.Group>
        <div className="button-container">
          <input className="form__button" type="submit" value="Submit" />

          <button
            className={
              props.match.params.id === undefined
                ? "hidden"
                : "form__button delete"
            }
            onClick={onDeleteClick}
          >
            Delete
          </button>
        </div>
      </Form>
    </div>
  );
};
