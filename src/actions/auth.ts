export interface LogState {
  logStatus: boolean;
  email: string;
  uid: string;
}

export interface LogInfo {
  type: "LOG_INFO";
  logStatus: LogState;
}

export const logInfo = (logStatus: LogState): LogInfo => ({
  type: "LOG_INFO",
  logStatus,
});

export interface StoreEmail {
  type: "STORE_EMAIL";
  email: LogState;
}

export const storeEmail = (email: LogState): StoreEmail => ({
  type: "STORE_EMAIL",
  email,
});

export interface StoreUID {
  type: "STORE_UID";
  uid: LogState;
}

export const storeUID = (uid: LogState): StoreUID => ({
  type: "STORE_UID",
  uid,
});
