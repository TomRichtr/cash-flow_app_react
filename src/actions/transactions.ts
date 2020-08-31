export interface TransactionState {
  id: any;
  type: string;
  amount: number;
  createdAt: number;
  note: string;
  description: string;
}

export interface AddTransaction {
  type: "ADD_TRANSACTION";
  transaction: TransactionState;
}

export const addTransaction = (
  transaction: TransactionState
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
  updates: TransactionState;
}

export const editTransaction = (
  id: any,
  updates: TransactionState
): EditTransaction => ({
  type: "EDIT_TRANSACTION",
  id,
  updates,
});
