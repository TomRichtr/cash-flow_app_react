import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import * as serviceWorker from "./serviceWorker";
import "./i18n";
import "normalize.css/normalize.css";
import "./styles/styles.scss";
import { Provider } from "react-redux";
import { store, persistor } from "./store/configureStore";
import { LoadingPage } from "../src/components/LoadingPage";
import "bootstrap/dist/css/bootstrap.min.css";
import { PersistGate } from "redux-persist/integration/react";
import { firebase } from "../src/firebase/firebase";

ReactDOM.render(<LoadingPage />, document.getElementById("root"));

let hasRendered = false;

const renderApp = () => {
  if (!hasRendered) {
    ReactDOM.render(
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <React.StrictMode>
            <App />
          </React.StrictMode>
        </PersistGate>
      </Provider>,
      document.getElementById("root")
    );
    hasRendered = true;
  }
};

renderApp();

serviceWorker.unregister();
