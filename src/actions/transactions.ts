export interface TransactionsState {
  id: any;
  type: string;
  amount: number;
  createdAt: string;
  note: string;
  description: string;
}

export interface AddTransaction {
  type: "ADD_TRANSACTION";
  transaction: TransactionsState;
}

export const addTransaction = (
  transaction: TransactionsState
): AddTransaction => ({
  type: "ADD_TRANSACTION",
  transaction: {
    ...transaction,
  },
});

export interface RemoveTransaction {
  type: "REMOVE_TRANSACTION";
  id: string;
}

export const removeTransaction = (id: any): RemoveTransaction => ({
  type: "REMOVE_TRANSACTION",
  id,
});

export interface EditTransaction {
  type: "EDIT_TRANSACTION";
  id: any;
  updates: TransactionsState;
}

export const editTransaction = (
  id: any,
  updates: TransactionsState
): EditTransaction => ({
  type: "EDIT_TRANSACTION",
  id,
  updates,
});
