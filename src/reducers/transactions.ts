import {
  AddTransaction,
  TransactionsState,
  RemoveTransaction,
  EditTransaction,
} from "../actions/transactions";

export default (
  state: TransactionsState[] = [],
  action: AddTransaction | RemoveTransaction | EditTransaction
): TransactionsState[] => {
  switch (action.type) {
    case "ADD_TRANSACTION":
      return [...state, action.transaction];
    case "REMOVE_TRANSACTION":
      return state.filter(({ id }) => id !== action.id);
    case "EDIT_TRANSACTION":
      return state.map((transaction) => {
        if (transaction.id === action.id) {
          return { ...transaction, ...action.updates };
        }
        return transaction;
      });
    default:
      return state;
  }
};
