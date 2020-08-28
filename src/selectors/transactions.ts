import { RootState } from "store/configureStore";

export function transactionsCount(state: RootState) {
  return state.transactionsReducer.length;
}

export function incomesCount(state: RootState) {
  return state.transactionsReducer.filter(function (transaction) {
    return transaction.type === "income";
  }).length;
}

export function expensesCount(state: RootState) {
  return state.transactionsReducer.filter(function (transaction) {
    return transaction.type === "expense";
  }).length;
}
