import { LogInfo, StoreEmail, StoreUID } from "../actions/auth";

const logInReducerDefaultState = {
  isLoggedIn: false,
};

export default (
  state = logInReducerDefaultState,
  action: LogInfo | StoreEmail | StoreUID
) => {
  switch (action.type) {
    case "LOG_INFO":
      return { ...state, logStatus: action.logStatus };
    case "STORE_EMAIL":
      return { ...state, email: action.email };
    case "STORE_UID":
      return { ...state, uid: action.uid };
    default:
      return state;
  }
};
