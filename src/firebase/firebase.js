import * as firebase from "firebase";
import { fbConfig } from "./env";

const firebaseConfig = {
  apiKey: fbConfig.apiKey,
  authDomain: fbConfig.authDomain,
  databaseURL: fbConfig.databaseURL,
  projectId: fbConfig.projectId,
  storageBucket: fbConfig.storageBucket,
  messagingSenderId: fbConfig.messagingSenderId,
  appId: fbConfig.appId,
  measurementId: fbConfig.measurementId,
};

firebase.initializeApp(firebaseConfig);

const database = firebase.firestore();

const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export { firebase, firebaseConfig, googleAuthProvider, database };
